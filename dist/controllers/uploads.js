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
exports.uploadFile = void 0;
const cloudinary_1 = require("cloudinary");
const user_1 = __importDefault(require("../models/user"));
const generateJWT_1 = require("../helpers/generateJWT");
if (process.env.CLOUDINARY_URL)
    cloudinary_1.v2.config(process.env.CLOUDINARY_URL);
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.files.file;
    const { id } = req.decoded;
    try {
        const path = file.tempFilePath;
        const { secure_url } = yield cloudinary_1.v2.uploader.upload(path, {
            folder: "Frida",
        });
        const user = yield user_1.default.findByIdAndUpdate(id, { img: secure_url }, {
            returnDocument: "after",
        });
        if (user)
            res.json({
                jwt: yield (0, generateJWT_1.newJWT)(user._id, user.fullname, user.email, user.area, user.img),
            });
        else
            res.status(400).json({ msg: "This user doesn't exist", id: "userdx" });
    }
    catch (error) {
        console.log(error);
    }
    // const { tempFilePath } = req.files.archivo;
    // const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    // console.log({ secure_url });
    res.end();
});
exports.uploadFile = uploadFile;
