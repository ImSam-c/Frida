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
exports.getStudents = exports.getTeachers = exports.getUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({ state: true });
    users ? res.json({ users }) : res.json({ msg: "There isn't users" });
});
exports.getUsers = getUsers;
const getTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teachers = yield user_1.default.find({ state: true }).where("area").exists(true);
    teachers ? res.json({ teachers }) : res.json({ msg: "There isn't teachers" });
});
exports.getTeachers = getTeachers;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield user_1.default.find({ state: true, area: null });
    students ? res.json({ students }) : res.json({ msg: "There isn't students" });
});
exports.getStudents = getStudents;
