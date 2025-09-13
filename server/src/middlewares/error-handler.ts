import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

export const errorHandler = (err: Error | HTTPException, c: Context) => {
  console.log("=== Caught Error ===");
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      err.status || 500
    );
  }
  if (err instanceof z.ZodError) {
    return c.json(
      {
        success: false,
        message:
          err.issues.map((err) => err.message).join(",\n") ||
          "Validation error",
      },
      400
    );
  }
  console.error(err);
  return c.text("Something went wrong", 500);
};