import mongoose from "mongoose";
import { mongodbcnn } from "../helpers/variables";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN || mongodbcnn);
    console.log("db connected");
  } catch (error) {
    throw new Error("database connect failed");
  }
};
