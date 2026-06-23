import type { FastifyRequest } from "fastify";
import { UserRole } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  phone: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends FastifyRequest {
  user?: AuthenticatedUser;
}
