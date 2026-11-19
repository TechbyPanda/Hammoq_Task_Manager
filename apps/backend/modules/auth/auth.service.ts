import bcrypt from "bcryptjs";
import { AppError } from "../../errors/AppError.js";
import * as userRepository from "../users/user.repository.js";
import { isDuplicateEmailError, toPublicUser } from "../users/user.service.js";
import { signToken } from "./auth.token.js";
import type { SignInInput, SignUpInput } from "./auth.validator.js";

const BCRYPT_ROUNDS = 10;

export const signUp = async ({ name, email, password }: SignUpInput) => {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    const user = await userRepository.insertUser({ name, email, passwordHash });
    return { user: toPublicUser(user), token: signToken(String(user._id)) };
  } catch (error) {
    if (isDuplicateEmailError(error)) throw new AppError("Email is already registered", 409);
    throw error;
  }
};

export const signIn = async ({ email, password }: SignInInput) => {
  const user = await userRepository.findUserByEmailWithPassword(email);
  const isValid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !isValid) throw new AppError("Invalid email or password", 401);

  return { user: toPublicUser(user), token: signToken(String(user._id)) };
};
