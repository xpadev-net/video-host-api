import bcrypt from "bcrypt";
import {PASSWORD_HASH_ROUNDS, PASSWORD_SALT} from "@/env";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password + PASSWORD_SALT, PASSWORD_HASH_ROUNDS);
}