import { PrismaClient, PaymentStatus, SubscriptionStatus } from '@prisma/client';
import { CreatePaymentInput, VerifyPaymentInput, CreateSubscriptionInput } from './payments.schema';
import { AppError } from '../../core/errors/AppError';
import { logger } from '../../config/logger';
import { clearCache } from '../../middleware/cache.middleware';

const prisma = new PrismaClient();

export class PaymentsService {
  async listPayments(studentId?: string) {
    const where = studentId ? { studentId } : {};
    return prisma.payment.findMany({
      where,
      orderBy: { paymentDate: 'desc' },
      include: {
        receipt: true,
        student: { select: { id: true, fullName: true, email: true } },
      },
    });
  }

  async initializePayment(input: CreatePaymentInput, studentId: string) {
    const existing = await prisma.payment.findUnique({ where: { reference: input.reference } });
    if (existing) {
      throw AppError.conflict('Payment reference already initialized.');
    }

    const payment = await prisma.payment.create({
      data: {
        studentId,
        reference: input.reference,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        status: PaymentStatus.pending,
      },
    });

    logger.info({ paymentId: payment.id, reference: payment.reference, amount: payment.amount }, '💳 Payment initialized');
    await clearCache('/api/v1/payments*');
    return payment;
  }

  async verifyPayment(input: VerifyPaymentInput) {
    const payment = await prisma.payment.findUnique({ where: { reference: input.reference } });
    if (!payment) {
      throw AppError.notFound('Payment reference not found.');
    }

    const updated = await prisma.payment.update({
      where: { reference: input.reference },
      data: {
        status: input.status,
        gatewayResponse: input.gatewayResponse ?? 'Verified via enterprise webhook/callback',
      },
    });

    if (input.status === PaymentStatus.success) {
      // 1. Generate automated receipt
      const receiptUrl = `https://portal.geoacademy.edu/receipts/${payment.reference}.pdf`;
      await prisma.paymentReceipt.upsert({
        where: { paymentId: payment.id },
        update: { receiptUrl },
        create: { paymentId: payment.id, receiptUrl },
      });

      // 2. Extend or activate Student Subscription by 30 days
      const currentSub = await prisma.studentSubscription.findUnique({ where: { studentId: payment.studentId } });
      const now = new Date();
      let newPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      if (currentSub && currentSub.currentPeriodEnd > now) {
        newPeriodEnd = new Date(currentSub.currentPeriodEnd.getTime() + 30 * 24 * 60 * 60 * 1000);
      }

      await prisma.studentSubscription.upsert({
        where: { studentId: payment.studentId },
        update: { currentPeriodEnd: newPeriodEnd, status: SubscriptionStatus.active },
        create: { studentId: payment.studentId, currentPeriodEnd: newPeriodEnd, status: SubscriptionStatus.active },
      });

      logger.info({ studentId: payment.studentId, reference: payment.reference }, '✅ Payment verified & subscription activated');
    }

    await clearCache('/api/v1/payments*');
    return updated;
  }

  async getSubscription(studentId: string) {
    const sub = await prisma.studentSubscription.findUnique({ where: { studentId } });
    if (!sub) {
      return { status: SubscriptionStatus.expired, currentPeriodEnd: null };
    }

    // Auto update status if expired
    if (sub.currentPeriodEnd < new Date() && sub.status === SubscriptionStatus.active) {
      await prisma.studentSubscription.update({
        where: { studentId },
        data: { status: SubscriptionStatus.expired },
      });
      return { ...sub, status: SubscriptionStatus.expired };
    }

    return sub;
  }

  async manageSubscription(input: CreateSubscriptionInput) {
    const now = new Date();
    const currentPeriodEnd = new Date(now.getTime() + input.durationDays * 24 * 60 * 60 * 1000);

    const sub = await prisma.studentSubscription.upsert({
      where: { studentId: input.studentId },
      update: { currentPeriodEnd, status: input.status },
      create: { studentId: input.studentId, currentPeriodEnd, status: input.status },
    });

    logger.info({ studentId: input.studentId, durationDays: input.durationDays }, '🛡️ Subscription managed by admin');
    return sub;
  }
}

export const paymentsService = new PaymentsService();
