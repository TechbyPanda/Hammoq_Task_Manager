import express from "express";
import taskRoutes from "../modules/tasks/task.routes.js";

const router = express.Router();

router.use("/task", taskRoutes);

export default router;