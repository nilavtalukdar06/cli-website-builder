import { DeviceRepository } from "src/repositories/device";
import { DeviceCode } from "src/utils/device-code";

export abstract class DeviceService {
  constructor() {}
  static async start() {
    const deviceCode = DeviceCode.generateDeviceCode();
    const userCode = DeviceCode.generateUserCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await DeviceRepository.create(deviceCode, userCode, expiresAt);
    return {
      deviceCode,
      userCode,
      expiresAt,
      verificationUrl: "http://localhost:3000/device",
    };
  }
}
