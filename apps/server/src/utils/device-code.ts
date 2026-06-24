import crypto from "crypto";

export abstract class DeviceCode {
  constructor() {}
  static generateDeviceCode() {
    return crypto.randomUUID();
  }
  static generateUserCode() {
    return (
      crypto.randomBytes(2).toString("hex").toUpperCase() +
      "-" +
      crypto.randomBytes(2).toString("hex").toUpperCase()
    );
  }
}
