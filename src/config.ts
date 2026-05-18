import { configDotenv } from "dotenv";

configDotenv();

export default {
  host: process.env.HOST ?? "localhost",
  port: Number(process.env.PORT ?? 3000),
};
