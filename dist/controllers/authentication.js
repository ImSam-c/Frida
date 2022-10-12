"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const register = (req, res) => {
    let { name, lastname, password, email, area } = req.body;
    let fullname = `${name} ${lastname}`;
    const salt = bcryptjs_1.default.genSaltSync();
    password = bcryptjs_1.default.hashSync(password, salt);
    if (area) {
        const user = new user_1.default({
            fullname,
            password,
            email,
            area,
        });
        res.status(201).json({ user });
        user.save();
    }
    else {
        const user = new user_1.default({
            fullname,
            password,
            email,
        });
        res.status(201).json({ user });
        user.save();
    }
    res.end();
};
exports.register = register;
