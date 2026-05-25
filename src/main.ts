import { readFileSync } from "fs";
import { createServer } from "https";
import app from "./app";
import { config } from "./config";

config();

const nodeEnv = process.env.NODE_ENV;
const port = +process.env.PORT!;
const host = process.env.HOST!;
const callback =
  ({ secure }: { secure: boolean }) =>
  () =>
    console.info(
      `Server is running on http${secure ? "s" : ""}://${host}:${port}`,
    );

if (nodeEnv === "development") {
  createServer(
    {
      pfx: readFileSync("./ssl.pfx"),
      passphrase: "passphrase",
    },
    app,
  ).listen(port, host, callback({ secure: true }));
} else {
  app.listen(port, host, callback({ secure: false }));
}
