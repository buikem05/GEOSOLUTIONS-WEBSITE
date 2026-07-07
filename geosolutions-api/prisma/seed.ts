import { PrismaClient, Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting automated Prisma database seed...');

  // 1. Clean up existing test data (optional in dev, safe order)
  await prisma.cbtExamSession.deleteMany();
  await prisma.result.deleteMany();
  await prisma.session.deleteMany();
  await prisma.paymentReceipt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.studentSubscription.deleteMany();
  await prisma.teacherPayoutRequest.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash passwords
  const adminPassword = await bcrypt.hash('adminpass', 10);
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  // 3. Create Super Admin
  const admin = await prisma.user.create({
    data: {
      id: 'admin-001',
      role: Role.admin,
      fullName: 'Super Administrator',
      identifier: 'ADMIN123',
      email: 'admin@geoacademy.edu',
      passwordHash: adminPassword,
      status: UserStatus.approved,
      avatarInitials: 'SA',
    },
  });
  console.log(`✅ Created Admin: ${admin.email}`);

  // 4. Create Teacher
  const teacher = await prisma.user.create({
    data: {
      id: 'teacher-001',
      role: Role.teacher,
      fullName: 'Dr. Sarah Johnson',
      identifier: 'sarah.johnson@geoacademy.edu',
      email: 'sarah.johnson@geoacademy.edu',
      passwordHash: teacherPassword,
      status: UserStatus.approved,
      subject: 'Mathematics',
      avatarInitials: 'SJ',
    },
  });
  console.log(`✅ Created Teacher: ${teacher.email}`);

  // 5. Create Student 1
  const student1 = await prisma.user.create({
    data: {
      id: 'student-001',
      role: Role.student,
      fullName: 'Michael Adeyemi',
      identifier: 'GEO/2024/001',
      email: 'm.adeyemi@geoacademy.edu',
      passwordHash: studentPassword,
      status: UserStatus.approved,
      avatarInitials: 'MA',
    },
  });
  console.log(`✅ Created Student 1: ${student1.email}`);

  // 6. Create Student 2 (Pending)
  const student2 = await prisma.user.create({
    data: {
      id: 'student-002',
      role: Role.student,
      fullName: 'Amara Okafor',
      identifier: 'GEO/2024/002',
      email: 'a.okafor@geoacademy.edu',
      passwordHash: studentPassword,
      status: UserStatus.pending,
      avatarInitials: 'AO',
    },
  });
  console.log(`✅ Created Student 2: ${student2.email}`);

  // 7. Seed Sample Results for Student 1
  const subjects = [
    { subject: 'Mathematics', score: 92.00, grade: 'A1' },
    { subject: 'English Language', score: 78.00, grade: 'B2' },
    { subject: 'Physics', score: 85.00, grade: 'B1' },
    { subject: 'Chemistry', score: 70.00, grade: 'B3' },
    { subject: 'Biology', score: 88.00, grade: 'A2' },
  ];

  for (const item of subjects) {
    await prisma.result.create({
      data: {
        studentId: student1.id,
        subject: item.subject,
        score: item.score,
        grade: item.grade,
        term: '1st Term',
        sessionYear: '2024/2025',
        createdBy: teacher.id,
      },
    });
  }
  console.log(`✅ Seeded 5 academic results for ${student1.email}`);

  console.log('🚀 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
