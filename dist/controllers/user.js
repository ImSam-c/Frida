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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverPassword = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getStudents = exports.getTeachers = exports.getUsers = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_1 = __importDefault(require("../models/user"));
const generateJWT_1 = require("../helpers/generateJWT");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({ state: true });
    users ? res.json({ users }) : res.json({ msg: "There aren't users" });
    res.end();
});
exports.getUsers = getUsers;
const getTeachers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teachers = yield user_1.default.find({ state: true }).where("area").exists(true);
    teachers
        ? res.json({ teachers })
        : res.json({ msg: "There aren't teachers" });
    res.end();
});
exports.getTeachers = getTeachers;
const getStudents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield user_1.default.find({ state: true, area: null });
    students
        ? res.json({ students })
        : res.json({ msg: "There aren't students" });
    res.end();
});
exports.getStudents = getStudents;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.default.findById(id, { state: true });
    user ? res.json(user) : res.json({ msg: "This user doesn't exist" });
    res.end();
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let _a = req.body, { state } = _a, rest = __rest(_a, ["state"]);
    const { id: idToUpdate } = req.params;
    const { id } = req.decoded;
    if (idToUpdate !== String(id))
        return res.status(401).json({ msg: "You cannot update this user" });
    const user = yield user_1.default.findById(idToUpdate);
    if (!user)
        return res.status(401).json({ msg: "This user doesn't exist" });
    if (rest.email)
        rest.email = rest.email.toLowerCase();
    if (rest.password) {
        const salt = bcryptjs_1.default.genSaltSync();
        rest.password = bcryptjs_1.default.hashSync(rest.password, salt);
    }
    yield user_1.default.findByIdAndUpdate(id, rest);
    user
        ? res.json({ msg: "User updated" })
        : res.json({ msg: "This user doesn't exist" });
    res.end();
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: idToDelete } = req.params;
    const { id } = req.decoded;
    const user = yield user_1.default.findById(idToDelete);
    if (!user)
        return res.status(401).json({ msg: "This user doesn't exist" });
    if (idToDelete !== String(id))
        return res.status(401).json({ msg: "You cannot delete this user" });
    yield user_1.default.findByIdAndUpdate(idToDelete, { state: false });
    res.json({ msg: "user deleted" });
    res.end();
});
exports.deleteUser = deleteUser;
const recoverPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_1.default.findOne({ email, state: true });
    if (!user)
        return res
            .status(400)
            .json({ msg: "A user with this email doesn't exist" });
    //* Creating new JWT and sending email
    try {
        const tkn = yield (0, generateJWT_1.newJWT)(user._id, "10m");
        let transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 25,
            secure: false,
            auth: {
                user: "noreply.frida@gmail.com",
                pass: "xckjuynqvwjmjjrs",
            },
        });
        yield transporter.sendMail({
            from: "noreply.frida@gmail.com",
            to: email,
            subject: "Recovering password",
            text: `Did you not request a password change? We recommend you to change it.\nTo recover your password join in this link: http://localhost:5000/../reset-password/index.html?temptKNrecvg=${tkn}`,
        });
        res.json({ msg: "Email sent" });
        res.end();
    }
    catch (error) {
        console.log(error);
        res.end();
    }
});
exports.recoverPassword = recoverPassword;
