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
exports.validateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const validateJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tokenAuth = (_a = req.header("authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!tokenAuth)
        return res
            .status(401)
            .json({ msg: "You must provide an authentication token" });
    try {
        const decoded = jsonwebtoken_1.default.verify(tokenAuth, process.env.secretOrPrivateKey || "");
        req.decoded = decoded;
        const { id } = decoded;
        //Getting user from payload of the JWT
        const user = yield user_1.default.findById(id, { state: true });
        if (!user)
            return res.status(400).json({ msg: "This user doesn't exist" });
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Invalid token, use a valid token",
            id: "it",
        });
    }
});
exports.validateJWT = validateJWT;
