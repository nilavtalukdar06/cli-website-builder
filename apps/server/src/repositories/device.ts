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
}
