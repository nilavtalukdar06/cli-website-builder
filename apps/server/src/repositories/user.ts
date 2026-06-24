import { prisma } from "../lib/prisma";

export abstract class UserRepository {
  constructor() {}
  static async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
  static async createUser(email: string, password: string) {
    const user = await prisma.user.create({
      data: { email, password },
    });
    return {
      id: user.id,
      email: user.email,
    };
  }
  static async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });
    return user;
  }
}
