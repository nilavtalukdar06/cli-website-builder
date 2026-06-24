import { User } from "generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      auth?: {
        userId: string;
        sessionId: string;
      };
    }
  }
}
