import { Schema, model } from "mongoose";

const teacherSchema = new Schema({
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

  area: {
    type: String,
    required: true,
  },
});

export default model("Teacher", teacherSchema);
