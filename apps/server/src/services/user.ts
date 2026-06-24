import { StatusCodes } from "http-status-codes";
import { UserRepository } from "src/repositories/user";
import { ApiError } from "src/utils/error";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "src/lib/jwt";
import { CliRepository } from "src/repositories/cli";

export abstract class UserService {
  constructor() {}
  static async signUp(email: string, password: string) {
    const exisitingUser = await UserRepository.findByEmail(email);
    if (exisitingUser) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        false,
        "user already exists",
        {},
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserRepository.createUser(email, hashedPassword);
    return user;
  }
  static async findById(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, false, "user not found", {});
    }
    return user;
  }
  static async refreshCliToken(refreshToken: string) {
    const token = await CliRepository.findByRefreshToken(refreshToken);
    if (!token) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        false,
        "invalid refresh token",
        {},
      );
    }
    if (token.expiresAt.getTime() < Date.now()) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        false,
        "refresh token expired",
        {},
      );
    }
    const accessToken = generateAccessToken(token.userId);
    return {
      accessToken,
      user: {
        id: token.user.id,
        email: token.user.email,
      },
    };
  }
}
