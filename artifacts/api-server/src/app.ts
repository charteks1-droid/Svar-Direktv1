import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { env } from "./lib/env.js";
import { globalRateLimit } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === "production",
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin:
      env.ALLOWED_ORIGINS?.includes("*") ? true : env.ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  }),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));

app.use(globalRateLimit);

app.use("/api", router);

app.use(errorHandler);

export default app;
