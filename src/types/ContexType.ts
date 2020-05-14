import { PrismaClient } from "@prisma/client";
import { Request } from "express";

interface RequestWithUser extends Request {
  userId?: string;
}

export interface ContextType {
  prisma: PrismaClient;
  req: RequestWithUser;
}
