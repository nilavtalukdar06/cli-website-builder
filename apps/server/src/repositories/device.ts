import { prisma } from "src/lib/prisma";

export abstract class DeviceRepository {
  constructor() {}
  static async create(deviceCode: string, userCode: string, expiresAt: Date) {
    const device = await prisma.deviceAuth.create({
      data: {
        userCode,
        deviceCode,
        expiresAt,
      },
    });
    return device;
  }
  static async findDeviceByCode(deviceCode: string) {
    const device = prisma.deviceAuth.findUnique({
      where: { deviceCode },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    return device;
  }
  static async findDeviceByUserCode(userCode: string) {
    const device = prisma.deviceAuth.findUnique({
      where: { userCode },
    });
    return device;
  }
  static async authorize(deviceId: string, userId: string) {
    const device = await prisma.deviceAuth.update({
      where: {
        id: deviceId,
      },
      data: {
        authorized: true,
        userId,
      },
    });
    return device;
  }
  static async consume(id: string) {
    const cli = await prisma.deviceAuth.update({
      where: { id },
      data: {
        consumed: true,
      },
    });
    return cli;
  }
}
