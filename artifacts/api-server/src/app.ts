import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { UPLOADS_DIR } from "./routes/uploads.js";
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

app.use("/api/uploads", express.static(UPLOADS_DIR));

app.get("/api/download/:filename", (req, res) => {
  const filename = req.params.filename.replace(/[^a-zA-Z0-9._-]/g, "");
  const filePath = `${UPLOADS_DIR}/${filename}`;
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.sendFile(filePath, { root: "/" }, (err) => {
    if (err) res.status(404).json({ error: "File not found" });
  });
});

app.use(globalRateLimit);

app.use("/api", router);

app.use(errorHandler);

export default app;
