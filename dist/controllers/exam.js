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
exports.verifyExam = exports.deleteExam = exports.getExamById = exports.createExam = exports.getExamsById = exports.getExams = void 0;
const exam_1 = __importDefault(require("../models/exam"));
const user_1 = __importDefault(require("../models/user"));
const getExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { subject, nQuestions } = req.query;
    let exams;
    const [min, max] = String(nQuestions).split("-");
    if (subject && nQuestions) {
        exams = yield exam_1.default.find({
            nQuestions: { $gte: Number(min), $lte: Number(max) },
            area: subject,
        }).populate("byTeacher", "fullname");
    }
    else if (subject) {
        exams = yield exam_1.default.find({ area: subject }).populate("byTeacher", "fullname");
    }
    else if (nQuestions) {
        exams = yield exam_1.default.find({
            nQuestions: { $gte: Number(min), $lte: Number(max) },
        }).populate("byTeacher", "fullname");
    }
    else {
        exams = yield exam_1.default.find().populate("byTeacher", "fullname");
    }
    console.log(yield exam_1.default.find());
    exams ? res.json(exams) : res.json({ msg: "There aren't exams" });
    res.end();
});
exports.getExams = getExams;
const getExamsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const exams = yield exam_1.default.find({ byTeacher: id }).populate("byTeacher", "fullname");
    exams
        ? res.json({ exams })
        : res.status(400).json({ msg: "This user doesn't have exams" });
    res.end();
});
exports.getExamsById = getExamsById;
const createExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comments, questions, nQuestions } = req.body;
    const { id } = req.decoded;
    const teacher = yield user_1.default.findOne({
        _id: id,
        state: true,
    });
    if (teacher) {
        const exam = yield new exam_1.default({
            area: teacher.area,
            questions,
            nQuestions,
            comments,
            byTeacher: id,
        }).populate("byTeacher", "fullname");
        exam.save();
        res.status(201).json({ exam });
    }
    else {
        return res
            .status(400)
            .json({ msg: "This user isn't a teacher or doesn't exist" });
    }
    res.end();
});
exports.createExam = createExam;
const getExamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const exam = yield exam_1.default.findById(id).populate("byTeacher", "fullname");
    exam
        ? res.json({ exam })
        : res.status(400).json({ msg: "This exam doesn't exist" });
    res.end();
});
exports.getExamById = getExamById;
const deleteExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: idToDelete } = req.params;
    const { id } = req.decoded || null;
    const exam = yield exam_1.default.findById(idToDelete);
    if (String(exam === null || exam === void 0 ? void 0 : exam.byTeacher._id) !== String(id))
        return res.status(401).json({ msg: "You cannot delete this exam" });
    yield (exam === null || exam === void 0 ? void 0 : exam.deleteOne());
    res.json({ msg: "Exam deleted" });
    res.end();
});
exports.deleteExam = deleteExam;
const verifyExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { answers } = req.body;
    const result = [];
    const exam = yield exam_1.default.findById(id);
    if (!exam)
        return res
            .status(400)
            .json({ msg: "This exam doesn't exist", id: "examdx" });
    exam.questions.forEach(({ options, correctAnswer }, i) => {
        options[correctAnswer - 1] === answers[i]
            ? result.push(true)
            : result.push(false);
    });
    res.json({ result });
    res.end();
});
exports.verifyExam = verifyExam;
