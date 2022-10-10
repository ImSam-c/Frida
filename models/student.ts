import { Schema, model } from "mongoose";

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  state: {
    type: Boolean,
    required: true,
  },
});

export default model("Student", studentSchema);
