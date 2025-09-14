import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "my_jwt_secret";


export function createJWT() {
  return jwt({
    secret: JWT_SECRET,
    alg: "HS256",
  });
}


import { SignJWT, type JWTPayload } from "jose";

export async function signToken(payload: JWTPayload, expiresIn = "7d") {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
}
