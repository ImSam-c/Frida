"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const variables_1 = require("./variables");
const newJWT = (id) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(id, process.env.SECRETORPRIVATEKEY || variables_1.secretOrPrivateKey, {
            expiresIn: "12h",
        }, (err, token) => {
            err ? reject(`The JWT could not be generated: ${err}`) : resolve(token);
        });
    });
};
exports.newJWT = newJWT;
