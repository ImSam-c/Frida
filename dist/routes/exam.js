"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exam_1 = require("../controllers/exam");
const validateJWT_1 = require("../middlewares/validateJWT");
const router = (0, express_1.Router)();
//* Getting all exams
router.get("/", validateJWT_1.validateJWT, exam_1.getExams);
//* Getting an exam by the id
router.get("/:id", validateJWT_1.validateJWT, exam_1.getExamById);
//* Creating an exam
router.post("/createExam", validateJWT_1.validateJWT, exam_1.createExam);
//* Deleting an exam by id
router.delete("/deleteExam/:id", validateJWT_1.validateJWT, exam_1.deleteExam);
//* Verifying an exam
router.post("/verifyExam/:id", validateJWT_1.validateJWT, exam_1.verifyExam);
exports.default = router;
