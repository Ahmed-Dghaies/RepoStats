import express from "express";
import "dotenv/config";
import { errorHandler } from "./src/middleware/errorHandler";
import registerRoutes from "./src/routes";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";

dotenv.config();

const app = express();
const port = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(express.json());
app.use(limiter);

if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173", // Frontend URL in dev
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
  );
}

registerRoutes(app);

app.use(errorHandler);

app.listen(port, () => {
  console.info(`Backend is running at http://localhost:${port}`);
});
