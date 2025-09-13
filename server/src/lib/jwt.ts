import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "my_jwt_secret";


function createJWT() {
  return jwt({
    secret: JWT_SECRET,
    alg: "HS256",
  });
}

function JWTMiddleware() {
  const middleware = createJWT();

  return async (c: Context, next: Next) => {
    try {
      await middleware(c, next);
    } catch (err) {
      return c.json(
        { success: false, message: "Invalid or missing JWT token" },
        401
      );
    }
  };
}

export const jwtMiddleware = JWTMiddleware();

import { SignJWT, type JWTPayload } from "jose";

export async function signToken(payload: JWTPayload, expiresIn = "7d") {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
}
