import { UserModel } from "./user.model.js";
import type { UpdateProfileInput } from "./user.validator.js";

type NewUser = { name: string; email: string; passwordHash: string };

export const insertUser = async (data: NewUser) => {
  const user = await UserModel.create(data);
  return user.toObject();
};

export const findUserById = (id: string) => UserModel.findById(id).lean();

export const findUserByEmailWithPassword = (email: string) =>
  UserModel.findOne({ email }).select("+passwordHash").lean();

export const updateUserById = (id: string, data: UpdateProfileInput) =>
  UserModel.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  }).lean();
