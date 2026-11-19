import express from "express";
import validate from "../../middleware/validate.js";
import { signIn, signOut, signUp } from "./auth.controller.js";
import { signInSchema, signUpSchema } from "./auth.validator.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/signin", validate(signInSchema), signIn);
router.post("/signout", signOut);

export default router;
