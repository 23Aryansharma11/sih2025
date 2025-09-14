import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { email, z } from "zod";
import { db } from "../db";
import { usersTable } from "../db/schema/user-schema";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-codes";
import { signToken } from "../lib/jwt";
import { jwtMiddleware } from "../middlewares/jwt-middleware";
import type { Context } from "hono";

export const authRoutes = new Hono();

const createUserSchema = z.object({
  email: z.email(),
  avatar: z.string().nonempty(),
  fullname: z.string().min(3, "Fullname cannot be less than 3 characters"),
});

export type UserType = z.infer<typeof createUserSchema> & {
  id: number;
};

authRoutes.post("/user", zValidator("json", createUserSchema), async (c) => {
  const userData = c.req.valid("json");
  let token;
  // check existing user
  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, userData.email),
  });

  if (user) {
    // create a jwt toke using user.id and user.email
    token = await signToken({ id: user.id, email: user.email });
  } else {
    // create user
    const newUser = await db
      .insert(usersTable)
      .values({
        ...userData,
      })
      .returning({ id: usersTable.id, email: usersTable.email });
    if (!newUser[0]) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, {
        message: "Unable to create new user",
      });
      return;
    }
    const { id, email } = newUser[0];
    // use this id and email to make a token
    token = await signToken({ id, email });
  }

  const isUserPresent = user ? true : false;
  const message = `${isUserPresent ? "User data fetched" : "New User created"}`;
  return c.json({ success: true, message, token }, StatusCodes.CREATED);
});

authRoutes.get("/user", jwtMiddleware, async (c: Context) => {
  const jwt = c.get("jwtPayload");

  const user = await db.query.usersTable.findFirst({
    where: (users, { eq, and }) =>
      and(eq(users.email, jwt.email), eq(users.id, jwt.id)),
  });

  if (!user) {
    return c.json(
      { success: false, message: "User not found" },
      StatusCodes.NOT_FOUND
    );
  }

  return c.json({ success: true, user }, StatusCodes.OK);
});
