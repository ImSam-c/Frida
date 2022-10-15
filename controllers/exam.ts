import { Request, Response } from "express";
import { reqID } from "../interfaces/interfaces";
import Exam from "../models/exam";
import User from "../models/user";

const getExams = async (req: Request, res: Response) => {
  const exams = await Exam.find().populate("byTeacher", "fullname");
  exams ? res.json({ exams }) : res.json({ msg: "There isn't exams" });
};

const createExam = async (req: Request, res: Response) => {
  const { comments, questions } = req.body;
  const { id } = (req as reqID).decoded;

  const teacher = await User.findOne({
    _id: id,
    state: true,
  });

  if (teacher) {
    const exam = await new Exam({
      area: teacher.area,
      questions,
      comments,
      byTeacher: id,
    }).populate("byTeacher", "fullname");
    exam.save();
    res.status(201).json({ exam });
  } else {
    return res
      .status(401)
      .json({ msg: "This user isn't a teacher or doesn't exist" });
  }

  res.end();
};

const getExamById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const exams = await Exam.findById(id).populate("byTeacher", "fullname");
  exams ? res.json({ exams }) : res.json({ msg: "This exam doesn't exist" });
};

const deleteExam = async (req: Request, res: Response) => {
  const { id: idToDelete } = req.params;
  const { id } = (req as reqID).decoded || null;

  const exam = await Exam.findById(idToDelete);

  if (String(exam?.byTeacher._id) !== String(id))
    return res.status(401).json({ msg: "You cannot delete this exam" });

  await exam?.deleteOne();
  res.json({ msg: "Exam deleted" });
};

const verifyExam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { answers } = req.body;
  const result: boolean[] = [];

  const exam = await Exam.findById(id);
  if (!exam) return res.status(400).json({ msg: "This exam doesn't exist" });

  exam.questions.forEach((question, i) => {
    question.correctAnswer === answers[i]
      ? result.push(true)
      : result.push(false);
  });

  res.json({ result });
};

export { getExams, createExam, getExamById, deleteExam, verifyExam };
