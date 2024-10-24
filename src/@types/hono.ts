import {Hono} from "hono";
import { User } from '@prisma/client'

export type HonoApp = Hono<{
  Variables: {
    user?: User;
  }
}>;