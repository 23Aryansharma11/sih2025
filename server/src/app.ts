import { Hono } from "hono";
import { logger } from "hono/logger";
import { errorHandler } from "./middlewares/error-handler";
import { cors } from "hono/cors";
import { authRoutes } from "./routes/auth-routes";

export const app = new Hono();

app.use("*", logger());

app.use(
  "*",
  cors({
    origin: "*",
  })
);

app.basePath("/api").route("/auth", authRoutes)

app.onError(errorHandler);
