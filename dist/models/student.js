"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("Student", studentSchema);
