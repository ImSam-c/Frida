import { Schema, model } from "mongoose";
import { examI } from "../interfaces/interfaces";

const examSchema = new Schema<examI>({
  area: {
    type: String,
    required: true,
  },

  byTeacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  questions: {
    type: [],
    required: true,
  },

  nQuestions: {
    type: Number,
    required: true,
  },

  comments: {
    type: String,
    default: "",
  },
});

examSchema.methods.toJSON = function () {
  const { __v, ...rest } = this.toObject();
  return rest;
};

export default model<examI>("Exam", examSchema);
