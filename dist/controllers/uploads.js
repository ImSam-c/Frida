"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const uploadFile = (req, res) => {
    console.log(req.files);
    res.end();
};
exports.uploadFile = uploadFile;
