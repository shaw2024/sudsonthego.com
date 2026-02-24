import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError, ZodSchema } from "zod";
import createHttpError from "http-errors";

type Location = "body" | "query" | "params";

export function validate<T extends ZodSchema | AnyZodObject>(schema: T, location: Location = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const payload = req[location];
      const result = schema.parse(payload);
      (req as any)[location] = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw createHttpError(400, error.issues.map((issue) => issue.message).join(", "));
      }
      next(error);
    }
  };
}