import { StatusCodes } from "http-status-codes";
import { UserRepository } from "src/repositories/user";
import { ApiError } from "src/utils/error";
import bcrypt from "bcryptjs";

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
}
