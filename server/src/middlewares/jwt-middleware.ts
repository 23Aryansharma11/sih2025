import type { Context, Next } from "hono";
import { createJWT } from "../lib/jwt";
import { db } from "../db";
import type { UserType } from "../routes/auth-routes";

function JWTMiddleware() {
  const middleware = createJWT();

  return async (c: Context & { user?: UserType }, next: Next) => {
    try {
      await middleware(c, next);

      const jwtPayload = c.get("jwtPayload");

      if (!jwtPayload?.email || !jwtPayload?.id) {
        return c.json(
          { success: false, message: "JWT token missing required fields" },
          401
        );
      }

      await next();
    } catch (err) {
      return c.json(
        { success: false, message: "Invalid or missing JWT token" },
        401
      );
    }
  };
}

export const jwtMiddleware = JWTMiddleware();
