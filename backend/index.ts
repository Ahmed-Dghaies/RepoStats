import express from "express";
import "dotenv/config";
import { errorHandler } from "./src/middleware/errorHandler";
import registerRoutes from "./src/routes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  console.log("Running in development mode");
  app.use(
    cors({
      origin: "http://localhost:5173", // Frontend URL in dev
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
  );
}

app.use(errorHandler);

registerRoutes(app);

app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});
