import { prisma } from "src/lib/prisma";

export abstract class CliRepository {
  constructor() {}
  static async create(refreshToken: string, userId: string, expiresAt: Date) {
    const cli = await prisma.cliAuth.create({
      data: {
        refreshToken,
        userId,
        expiresAt,
      },
    });
    return cli;
  }
  static async findByRefreshToken(refreshToken: string) {
    const cli = await prisma.cliAuth.findUnique({
      where: { refreshToken },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });
    return cli;
  }
  static async delete(id: string) {
    const cli = await prisma.cliAuth.delete({
      where: { id },
    });
    return cli;
  }
}
