import { drizzle } from "drizzle-orm/postgres-js";
import * as userSchema from "./schema/user-schema";
import postgres from "postgres";

import { config } from "dotenv";
config();

const queryClient = postgres(process.env.DATABASE_URL as string);
export const db = drizzle(queryClient, { schema: { ...userSchema } });
