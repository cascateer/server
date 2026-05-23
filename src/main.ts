import app from "./app";
import { config } from "./config";

config();

app.listen(+process.env.PORT!, process.env.HOST!, () =>
  console.info(`Server is running on ${process.env.HOST}:${process.env.PORT}`),
);
