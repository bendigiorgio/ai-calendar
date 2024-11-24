import { drizzle } from "drizzle-orm/libsql";
import dotenv from "dotenv";

dotenv.config();

export const db = drizzle(process.env.DB_URL!, {
  schema: {},
});
