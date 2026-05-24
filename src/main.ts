import { readFileSync } from "fs";
import { createServer } from "https";
import app from "./app";
import { config } from "./config";

config();

createServer(
  {
    pfx: readFileSync("./ssl.pfx"),
    passphrase: "passphrase",
  },
  app,
).listen(+process.env.PORT!, process.env.HOST!, () =>
  console.info(
    `Server is running on https://${process.env.HOST}:${process.env.PORT}`,
  ),
);
