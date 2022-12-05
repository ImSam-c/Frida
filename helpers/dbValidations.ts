import User from "../models/user";
import { ObjectId } from "mongoose";

export const emailExists = async (email: string = "") => {
  const emailE = await User.findOne({
    email: email.toLowerCase(),
    state: true,
  });

  const objectError = {
    msg: `The email ${email} is already registered`,
    id: "uEmail",
  };

  if (emailE) throw new Error(JSON.stringify(objectError));
};

export const existsUserById = async (id: ObjectId) => {
  const userE = await User.findById(id);

  if (!userE) throw new Error(`Id ${id} isn't registered`);
};
