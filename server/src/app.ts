import { Hono } from "hono";
import { logger } from "hono/logger";
import { errorHandler } from "./middlewares/error-handler";

export const app = new Hono();

app.use("*", logger());

app.onError(errorHandler)