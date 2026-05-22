import { RedisStore } from "connect-redis";
import cors from "cors";
import { randomBytes } from "crypto";
import { configDotenv } from "dotenv";
import express, { json } from "express";
import session from "express-session";
import { google } from "googleapis";
import { createClient } from "redis";

configDotenv();

const app = express();

const redisClient = createClient({
  url: "rediss://red-d85ncvt7vvec73efpmig:JzhYUQksQY1ClAli558oI8sFT1kkiSkW@ohio-keyvalue.render.com:6379",
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
});

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  "https://server-jp2n.onrender.com/youtube/auth-callback",
);

app.use(json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://cascateer.dev/"],
    credentials: true,
  }),
);
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secret secret",
    store: redisStore
  }),
);

app.use("/rubiks/baseMoves", (req, res, next) =>
  res.json({
    Z: [
      { key: "B", action: [{ slice: "B" }] },
      { key: "Bi", action: [{ slice: "B", degree: -1 }] },
      { key: "B2", action: [{ slice: "B", degree: 2 }] },
      {
        key: "Bw",
        action: [{ slice: "B" }, { slice: "S", degree: -1 }],
      },
      { key: "F", action: [{ slice: "F" }] },
      { key: "Fi", action: [{ slice: "F", degree: -1 }] },
      { key: "F2", action: [{ slice: "F", degree: 2 }] },
      { key: "Fw", action: [{ slice: "F" }, { slice: "S" }] },
      { key: "S", action: [{ slice: "S" }] },
      { key: "Si", action: [{ slice: "S", degree: -1 }] },
      { key: "S2", action: [{ slice: "S", degree: 2 }] },
      {
        key: "z",
        action: [{ slice: "B", degree: -1 }, { slice: "S" }, { slice: "F" }],
      },
    ],
    Y: [
      { key: "U", action: [{ slice: "U" }] },
      { key: "Ui", action: [{ slice: "U", degree: -1 }] },
      { key: "U2", action: [{ slice: "U", degree: 2 }] },
      { key: "D", action: [{ slice: "D" }] },
      { key: "Di", action: [{ slice: "D", degree: -1 }] },
      { key: "D2", action: [{ slice: "D", degree: 2 }] },
      { key: "E", action: [{ slice: "E" }] },
      { key: "Ei", action: [{ slice: "E", degree: -1 }] },
      { key: "E2", action: [{ slice: "E", degree: 2 }] },
      {
        key: "Uw",
        action: [{ slice: "U" }, { slice: "E", degree: -1 }],
      },
      { key: "Dw", action: [{ slice: "D" }, { slice: "E" }] },
      {
        key: "y",
        action: [
          { slice: "D", degree: -1 },
          { slice: "E", degree: -1 },
          { slice: "U" },
        ],
      },
    ],
    X: [
      { key: "L", action: [{ slice: "L" }] },
      { key: "Li", action: [{ slice: "L", degree: -1 }] },
      { key: "L2", action: [{ slice: "L", degree: 2 }] },
      { key: "R", action: [{ slice: "R" }] },
      { key: "Ri", action: [{ slice: "R", degree: -1 }] },
      { key: "R2", action: [{ slice: "R", degree: 2 }] },
      {
        key: "x",
        action: [
          { slice: "L", degree: -1 },
          { slice: "M", degree: -1 },
          { slice: "R" },
        ],
      },
      { key: "Lw", action: [{ slice: "L" }, { slice: "M" }] },
      {
        key: "Rw",
        action: [{ slice: "R" }, { slice: "M", degree: -1 }],
      },
      { key: "M", action: [{ slice: "M" }] },
      { key: "Mi", action: [{ slice: "M", degree: -1 }] },
      { key: "M2", action: [{ slice: "M", degree: 2 }] },
    ],
  }),
);

app.use("/rubiks/customMoves", (req, res, next) =>
  res.json([
    {
      key: "Sexy Move",
      action: [
        { slice: "U" },
        { slice: "R" },
        { slice: "U", degree: -1 },
        { slice: "R", degree: -1 },
      ],
    },
  ]),
);

app.use(
  "/youtube/auth",
  (req, res) => (
    res.send(
      oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/youtube.force-ssl"],
        include_granted_scopes: true,
        state: (req.session.state = randomBytes(32).toString("hex")),
      }),
    ),
  ),
);

app.use(
  "/youtube/auth-callback",
  async (req, res) => (
    req.query.state === req.session.state
      ? oauth2Client.getToken(`${req.query.code}`).then(({ tokens }) => {
          oauth2Client.setCredentials(tokens);
          res.send(tokens);
        })
      : res.sendStatus(401)
  ),
);

app.use("/youtube/test", async (req, res) =>
  res.send(oauth2Client.credentials),
);

export default app;
