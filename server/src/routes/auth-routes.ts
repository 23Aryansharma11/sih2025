import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { email, z } from "zod";
import { db } from "../db";
import { usersTable } from "../db/schema/user-schema";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-codes";
import { signToken } from "../lib/jwt";

export const authRoutes = new Hono();

const createUserSchema = z.object({
  email: z.email(),
  avatar: z.string().nonempty(),
  fullname: z.string().min(3, "Fullname cannot be less than 3 characters"),
});

authRoutes.post("/user", zValidator("json", createUserSchema), async (c) => {
  const userData = c.req.valid("json");
  let token;
  // check existing user
  const user = await db.query.usersTable.findFirst({
    with: {
      email: userData.email,
    },
  });

  if (user) {
    // create a jwt toke using user.id and user.email
    token = signToken({ id: user.id, email: user.email });
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
    token = signToken({ id, email });
  }

  return c.json(
    { success: true, message: "New user created", token },
    StatusCodes.CREATED
  );
});
