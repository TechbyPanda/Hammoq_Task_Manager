import type { Request, Response } from "express";
import * as userService from "./user.service.js";
import type { UpdateProfileInput } from "./user.validator.js";

export const getMyProfile = async (req: Request, res: Response) => {
  const user = await userService.getProfile(req.user!.id);
  res.status(200).json(user);
};

export const updateMyProfile = async (req: Request, res: Response) => {
  const user = await userService.updateProfile(req.user!.id, req.body as UpdateProfileInput);
  res.status(200).json(user);
};
