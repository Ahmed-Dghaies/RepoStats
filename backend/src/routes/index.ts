import { Application } from "express";
import userRoutes from "../features/user/routes";
import repositoryRoutes from "../features/repository/routes";

export default function registerRoutes(app: Application) {
  app.use("/user", userRoutes);
  app.use("/repository", repositoryRoutes);
}
