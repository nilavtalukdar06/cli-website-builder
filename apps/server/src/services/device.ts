import { StatusCodes } from "http-status-codes";
import { CliRepository } from "src/repositories/cli";
import { DeviceRepository } from "src/repositories/device";
import { DeviceCode } from "src/utils/device-code";
import { ApiError } from "src/utils/error";
import { generateRefreshToken } from "src/utils/token";

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
  static async authorize(userCode: string, userId: string) {
    const device = await DeviceRepository.findDeviceByUserCode(userCode);
    if (!device) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        false,
        "invalid device code",
        {},
      );
    }
    if (device.expiresAt.getTime() < Date.now()) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        false,
        "device code expired",
        {},
      );
    }
    if (device.authorized) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        false,
        "device is authorized",
        {},
      );
    }
    const result = await DeviceRepository.authorize(device.id, userId);
    return result;
  }
  static async poll(deviceCode: string) {
    const device = await DeviceRepository.findDeviceByCode(deviceCode);
    if (!device) {
      throw new ApiError(StatusCodes.NOT_FOUND, false, "device not found", {});
    }
    if (device.expiresAt.getTime() < Date.now()) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        false,
        "device code has expired",
        {},
      );
    }
    if (!device.authorized) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        false,
        "device is not authorized",
        {},
      );
    }
    if (!device.user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        false,
        "no user associated with this authorized device",
        {},
      );
    }
    if (device.consumed) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        false,
        "token already consumed",
        {},
      );
    }
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await DeviceRepository.consume(device.id);
    await CliRepository.create(refreshToken, device.userId!, expiresAt);
    return {
      authorized: true,
      refreshToken,
    };
  }
}
