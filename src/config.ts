import { configDotenv } from "dotenv";

export const config = () =>
  configDotenv({
    path: [".env.local", ".env"],
  });
