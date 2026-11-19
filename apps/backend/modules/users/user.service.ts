import { AppError } from "../../errors/AppError.js";
import * as userRepository from "./user.repository.js";
import type { UpdateProfileInput } from "./user.validator.js";

const MONGO_DUPLICATE_KEY = 11000;

const userNotFound = () => new AppError("User not found", 404);

type UserRecord = { _id: unknown; name: string; email: string; createdAt: Date; updatedAt: Date };

export const toPublicUser = ({ _id, name, email, createdAt, updatedAt }: UserRecord) => ({
  _id,
  name,
  email,
  createdAt,
  updatedAt,
});

export const isDuplicateEmailError = (error: unknown) =>
  (error as { code?: number }).code === MONGO_DUPLICATE_KEY;

export const getProfile = async (userId: string) => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw userNotFound();
  return toPublicUser(user);
};

export const updateProfile = async (userId: string, input: UpdateProfileInput) => {
  try {
    const user = await userRepository.updateUserById(userId, input);
    if (!user) throw userNotFound();
    return toPublicUser(user);
  } catch (error) {
    if (isDuplicateEmailError(error)) throw new AppError("Email is already in use", 409);
    throw error;
  }
};
