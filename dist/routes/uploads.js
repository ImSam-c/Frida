"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploads_1 = require("../controllers/uploads");
const validateJWT_1 = require("../middlewares/validateJWT");
const router = (0, express_1.Router)();
router.post("/", validateJWT_1.validateJWT, uploads_1.uploadFile);
