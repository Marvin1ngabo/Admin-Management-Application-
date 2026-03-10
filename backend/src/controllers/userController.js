const { PrismaClient } = require('@prisma/client');
const { successResponse } = require('../utils/response');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return successResponse(res, users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return successResponse(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, role, isActive } = req.body;

      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          firstName,
          lastName,
          email,
          role,
          isActive,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
      });

      return successResponse(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      return successResponse(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
