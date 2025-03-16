import express from "express";
import "dotenv/config";
import { errorHandler } from "./src/middleware/errorHandler.js";
import registerRoutes from "./src/routes/index.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use(errorHandler);

registerRoutes(app);

app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});
