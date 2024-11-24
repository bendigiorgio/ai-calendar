import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./src/db/models/**/*.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  verbose: true,
  strict: true,
  out: "./migrations",
});
