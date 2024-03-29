"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const teacherSchema = new mongoose_1.Schema({
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    state: {
        type: Boolean,
        required: true,
        default: true,
    },
    area: {
        type: String,
        required: true,
    },
});
teacherSchema.methods.toJSON = function () {
    const _a = this.toObject(), { _id, password, state, __v } = _a, rest = __rest(_a, ["_id", "password", "state", "__v"]);
    return rest;
};
exports.default = (0, mongoose_1.model)("Teacher", teacherSchema);
