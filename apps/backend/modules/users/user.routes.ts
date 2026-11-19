import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import validate from "../../middleware/validate.js";
import { getMyProfile, updateMyProfile } from "./user.controller.js";
import { updateProfileSchema } from "./user.validator.js";

const router = express.Router();

router.get("/me", requireAuth, getMyProfile);
router.patch("/me", requireAuth, validate(updateProfileSchema), updateMyProfile);

export default router;
