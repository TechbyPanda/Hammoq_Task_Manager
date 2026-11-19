import type { Request, Response } from "express";
import * as authService from "./auth.service.js";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "./auth.token.js";
import type { SignInInput, SignUpInput } from "./auth.validator.js";

export const signUp = async (req: Request, res: Response) => {
  const { user, token } = await authService.signUp(req.body as SignUpInput);
  res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
  res.status(201).json(user);
};

export const signIn = async (req: Request, res: Response) => {
  const { user, token } = await authService.signIn(req.body as SignInInput);
  res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
  res.status(200).json(user);
};

export const signOut = (_req: Request, res: Response) => {
  // maxAge must be omitted when clearing, otherwise Express sets a new expiry instead.
  const { maxAge: _maxAge, ...clearOptions } = AUTH_COOKIE_OPTIONS;
  res.clearCookie(AUTH_COOKIE_NAME, clearOptions);
  res.status(204).end();
};
