const { PrismaClient } = require('@prisma/client');
const { successResponse } = require('../utils/response');

const prisma = new PrismaClient();

class DashboardController {
  async getStats(req, res, next) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      let stats = {};

      if (userRole === 'TEACHER') {
        // Get teacher's classes
        const teacher = await prisma.teacher.findUnique({
          where: { userId },
          include: {
            classes: {
              include: {
                students: true,
              },
            },
          },
        });

        const totalStudents = teacher?.classes.reduce((sum, c) => sum + c.students.length, 0) || 0;

        stats = {
          totalClasses: teacher?.classes.length || 0,
          totalStudents,
          subjects: teacher?.subjects || [],
        };
      } else if (userRole === 'ADMIN') {
        // Get admin stats
        const totalStudents = await prisma.student.count();
        const totalTeachers = await prisma.teacher.count();

        // Calculate attendance rate
        const attendanceRecords = await prisma.attendance.findMany();
        const presentCount = attendanceRecords.filter(a => a.status === 'PRESENT').length;
        const attendanceRate = attendanceRecords.length > 0
          ? ((presentCount / attendanceRecords.length) * 100).toFixed(1)
          : 0;

        // Calculate fee collection (approved deposits this month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const deposits = await prisma.feeTransaction.aggregate({
          where: {
            type: 'DEPOSIT',
            status: 'APPROVED',
            createdAt: {
              gte: startOfMonth,
            },
          },
          _sum: { amount: true },
        });

        const feeCollection = deposits._sum.amount || 0;

        // Get pending devices
        const pendingDevices = await prisma.device.count({
          where: { verified: false },
        });

        // Get pending withdrawals
        const pendingWithdrawals = await prisma.feeTransaction.count({
          where: {
            type: 'WITHDRAWAL',
            status: 'PENDING',
          },
        });

        stats = {
          totalStudents,
          totalTeachers,
          attendanceRate,
          feeCollection,
          pendingDevices,
          pendingWithdrawals,
        };
      }

      return successResponse(res, stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
