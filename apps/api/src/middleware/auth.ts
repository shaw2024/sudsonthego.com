import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { supabaseAdmin } from "../lib/supabase";

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.replace("Bearer ", "").trim();
}

export async function authRequired(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    throw createHttpError(401, "Unauthorized");
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    throw createHttpError(401, "Invalid auth token");
  }

  const role = (data.user.user_metadata?.role as UserRole | undefined) ?? UserRole.CUSTOMER;

  const dbUser = await prisma.user.upsert({
    where: { id: data.user.id },
    update: {
      role,
      name: (data.user.user_metadata?.name as string | undefined) ?? "User",
      email: data.user.email ?? `${data.user.id}@example.local`,
      phone: data.user.phone ?? null
    },
    create: {
      id: data.user.id,
      email: data.user.email ?? `${data.user.id}@example.local`,
      role,
      name: (data.user.user_metadata?.name as string | undefined) ?? "User",
      phone: data.user.phone ?? null
    }
  });

  req.user = {
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
    name: dbUser.name,
    phone: dbUser.phone ?? undefined
  };

  next();
}

export function roleRequired(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw createHttpError(401, "Unauthorized");
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw createHttpError(403, "Forbidden");
    }
    next();
  };
}