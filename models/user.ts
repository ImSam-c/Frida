import { Schema, model } from "mongoose";
import { userI } from "../interfaces/interfaces";

const userSchema = new Schema<userI>({
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  area: { type: String },
  state: { type: Boolean, default: true },
  img: { type: String },
});

userSchema.methods.toJSON = function () {
  const { password, state, __v, ...rest } = this.toObject();
  return rest;
};

export default model<userI>("User", userSchema);
