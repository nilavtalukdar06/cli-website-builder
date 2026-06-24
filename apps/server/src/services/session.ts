import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { SessionRepository } from "src/repositories/session";
import { UserRepository } from "src/repositories/user";
import { ApiError } from "src/utils/error";

export abstract class SessionService {
  constructor() {}
  static async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        false,
        "invalid credentials",
        {},
      );
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        false,
        "invalid credentials",
        {},
      );
    }
    const session = await SessionRepository.createSession(
      user.id,
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    );
    return {
      user,
      session,
    };
  }
  static async logout(sessionId: string) {
    const session = await SessionRepository.deleteSession(sessionId);
    return session;
  }
}
