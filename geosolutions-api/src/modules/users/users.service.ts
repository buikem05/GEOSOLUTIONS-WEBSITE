import { PrismaClient, Prisma } from '@prisma/client';
import { ListUsersQuery, UpdateStatusInput } from './users.schema';
import { AppError } from '../../core/errors/AppError';
import { logger } from '../../config/logger';
import { clearCache } from '../../middleware/cache.middleware';

const prisma = new PrismaClient();

export class UsersService {
  async listUsers(query: ListUsersQuery) {
    const { page, limit, role, status, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { identifier: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          role: true,
          fullName: true,
          identifier: true,
          email: true,
          status: true,
          subject: true,
          phone: true,
          avatarInitials: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        fullName: true,
        identifier: true,
        email: true,
        status: true,
        subject: true,
        phone: true,
        avatarInitials: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }
    return user;
  }

  async updateStatus(id: string, input: UpdateStatusInput) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw AppError.notFound('User not found');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status: input.status },
      select: { id: true, email: true, status: true },
    });

    logger.info({ userId: id, oldStatus: user.status, newStatus: input.status }, '⚡ Admin updated user status');

    // If user is suspended or rejected, revoke all their active sessions
    if (['rejected', 'suspended'].includes(input.status)) {
      await prisma.session.deleteMany({ where: { userId: id } });
      logger.warn({ userId: id }, '🔒 Revoked all sessions for suspended/rejected user');
    }

    await clearCache('/api/v1/users*');
    return updated;
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw AppError.notFound('User not found');
    }

    await prisma.user.delete({ where: { id } });
    logger.info({ userId: id, email: user.email }, '🗑️ Admin deleted user account');

    await clearCache('/api/v1/users*');
  }
}

export const usersService = new UsersService();
