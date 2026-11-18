import express from "express";

const router = express.Router();

router.use("/tasks", taskRoutes);

export default router;