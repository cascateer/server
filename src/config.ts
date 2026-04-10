import dotenv from "dotenv";

dotenv.config();

export default {
  host: process.env.HOST ?? "localhost",
  port: Number(process.env.PORT ?? 3000),
};
