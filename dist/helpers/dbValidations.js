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
exports.existsUserById = exports.emailExists = void 0;
const user_1 = __importDefault(require("../models/user"));
const emailExists = (email = "") => __awaiter(void 0, void 0, void 0, function* () {
    const emailE = yield user_1.default.findOne({
        email: email.toLowerCase(),
        state: true,
    });
    const objectError = {
        msg: `The email ${email} is already registered`,
        id: "uEmail",
    };
    if (emailE)
        throw new Error(JSON.stringify(objectError));
});
exports.emailExists = emailExists;
const existsUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userE = yield user_1.default.findById(id);
    if (!userE)
        throw new Error(`Id ${id} isn't registered`);
});
exports.existsUserById = existsUserById;
