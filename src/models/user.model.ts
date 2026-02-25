
import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';
import type { SignupDTO } from '../validators/user.validator';

export const UserModel = {
  async create(data: SignupDTO) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existing) {
      const error = new Error('Email already exists');
      (error as any).statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(data.password);
    
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true }
    });
  }
};