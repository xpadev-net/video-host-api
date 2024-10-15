import {prisma} from "@/lib/prisma";
import {TOKEN_EXPIRY} from "@/env";

export const createSession = async(userId: string): Promise<string> => {
  const token = Math.random().toString(36).substring(7);
  await prisma.session.create({
    data: {
      token,
      userId,
      expiredAt: new Date(Date.now() + TOKEN_EXPIRY)
    }
  });
  return token;
}