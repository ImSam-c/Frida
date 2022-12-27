"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newJWT = (id, name, email, area, img, exp = "12h") => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ id, name, email, area, img }, process.env.SECRETORPRIVATEKEY || "", {
            expiresIn: exp,
        }, (err, token) => {
            err ? reject(`The JWT could not be generated: ${err}`) : resolve(token);
        });
    });
};
exports.newJWT = newJWT;
