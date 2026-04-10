import app from "./app";
import config from "./config";

app.listen(config.port, config.host, () =>
  console.info(`Server is running on ${config.host}:${config.port}`),
);
