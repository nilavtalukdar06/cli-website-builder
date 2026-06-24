import { prisma } from "src/lib/prisma";

export abstract class SessionRepository {
  constructor() {}
  static async createSession(userId: string, expiresAt: Date) {
    const session = await prisma.session.create({
      data: {
        userId,
        expiresAt,
      },
    });
    return session;
  }
  static async findById(id: string) {
    const session = await prisma.session.findUnique({
      where: {
        id,
      },
      include: { user: true },
    });
    return session;
  }
  static async deleteSession(id: string) {
    const session = await prisma.session.delete({
      where: { id },
    });
    return session;
  }
}
