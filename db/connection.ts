import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN || "");
    console.log("DB Connected");
  } catch (error) {
    throw new Error("database connect failed");
  }
};
