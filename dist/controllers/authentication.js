"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const generateJWT_1 = require("../helpers/generateJWT");
const register = (req, res) => {
    let { name, lastname, password, email, area } = req.body;
    let fullname = `${name} ${lastname}`;
    email = email.toLowerCase();
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
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //Verifying email
    const user = yield user_1.default.findOne({ email, state: true });
    if (!user)
        return res.status(400).json({ msg: "This user doesn't exist" });
    //Verifying password
    const passwordMatch = bcryptjs_1.default.compareSync(password, user.password);
    if (!passwordMatch)
        return res.status(401).json({ msg: "Incorrect credentials" });
    const jwt = yield (0, generateJWT_1.newJWT)(user._id).catch((err) => {
        throw new Error(err);
    });
    return res.json({ user, jwt });
});
exports.login = login;
