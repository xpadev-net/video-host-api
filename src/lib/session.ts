import {prisma} from "@/lib/prisma";
import {JWT_SECRET, TOKEN_EXPIRY} from "@/env";
import jwt from "jsonwebtoken";

export const createSession = async(userId: string): Promise<string> => {
  const expiredAt = new Date(Date.now() + TOKEN_EXPIRY);
  const token = jwt.sign({
    userId,
    expiredAt
  }, JWT_SECRET);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiredAt,
    }
  });
  return token;
}
