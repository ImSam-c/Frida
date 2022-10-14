import User from "../models/user";
import { ObjectId } from "mongoose";

export const emailExists = async (email: string = "") => {
  const emailE = await User.findOne({ email: email.toLowerCase() });

  if (emailE) throw new Error(`The email ${email} is already registered`);
};

export const existsUserById = async (id: ObjectId) => {
  const userE = await User.findById(id);

  if (!userE) throw new Error(`Id ${id} isn't registered`);
};
