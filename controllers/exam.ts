import { Request, Response } from "express";
import { reqID } from "../interfaces/interfaces";
import Exam from "../models/exam";
import User from "../models/user";

const getExams = async (req: Request, res: Response) => {
  let { subject, nQuestions } = req.query;
  let exams;

  const [min, max] = String(nQuestions).split("-");

  if (subject && nQuestions) {
    exams = await Exam.find({
      nQuestions: { $gte: Number(min), $lte: Number(max) },
      area: subject,
    }).populate("byTeacher", "fullname");
  } else if (subject) {
    exams = await Exam.find({ area: subject }).populate(
      "byTeacher",
      "fullname"
    );
  } else if (nQuestions) {
    exams = await Exam.find({
      nQuestions: { $gte: Number(min), $lte: Number(max) },
    }).populate("byTeacher", "fullname");
  } else {
    exams = await Exam.find().populate("byTeacher", "fullname");
  }

  exams ? res.json(exams) : res.json({ msg: "There aren't exams" });
};

const getExamsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const exams = await Exam.find({ byTeacher: id }).populate(
    "byTeacher",
    "fullname"
  );
  exams
    ? res.json({ exams })
    : res.status(400).json({ msg: "This user doesn't have exams" });
  res.end();
};

const createExam = async (req: Request, res: Response) => {
  const { comments, questions, nQuestions } = req.body;
  const { id } = (req as reqID).decoded;

  const teacher = await User.findOne({
    _id: id,
    state: true,
  });

  if (teacher) {
    const exam = await new Exam({
      area: teacher.area,
      questions,
      nQuestions,
      comments,
      byTeacher: id,
    }).populate("byTeacher", "fullname");
    exam.save();
    res.status(201).json({ exam });
  } else {
    return res
      .status(400)
      .json({ msg: "This user isn't a teacher or doesn't exist" });
  }

  res.end();
};

const getExamById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const exam = await Exam.findById(id).populate("byTeacher", "fullname");
  exam
    ? res.json({ exam })
    : res.status(400).json({ msg: "This exam doesn't exist" });
  res.end();
};

const deleteExam = async (req: Request, res: Response) => {
  const { id: idToDelete } = req.params;
  const { id } = (req as reqID).decoded || null;

  const exam = await Exam.findById(idToDelete);

  if (String(exam?.byTeacher._id) !== String(id))
    return res.status(401).json({ msg: "You cannot delete this exam" });

  await exam?.deleteOne();
  res.json({ msg: "Exam deleted" });
  res.end();
};

const verifyExam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { answers } = req.body;
  const result: boolean[] = [];

  const exam = await Exam.findById(id);
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
};

export {
  getExams,
  getExamsById,
  createExam,
  getExamById,
  deleteExam,
  verifyExam,
};
