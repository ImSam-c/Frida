import { Router } from "express";
import {
  createExam,
  deleteExam,
  getExamById,
  getExams,
  verifyExam,
} from "../controllers/exam";
import { validateJWT } from "../middlewares/validateJWT";

const router = Router();

//* Getting all exams
router.get("/", getExams);

//* Getting an exam by the id
router.get("/:id", getExamById);

//* Creating an exam
router.post("/createExam", validateJWT, createExam);

//* Deleting an exam by id
router.delete("/deleteExam/:id", validateJWT, deleteExam);

//* Verifying an exam
router.post("/verifyExam/:id", validateJWT, verifyExam);

export default router;
