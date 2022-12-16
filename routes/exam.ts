import { Router } from "express";
import {
  createExam,
  deleteExam,
  getExamById,
  getExams,
  getExamsById,
  verifyExam,
} from "../controllers/exam";
import { validateJWT } from "../middlewares/validateJWT";

const router = Router();

//* Getting all exams
router.get("/", validateJWT, getExams);

//* Getting an exam by the id
router.get("/:id", validateJWT, getExamById);

//* Getting exams by teacher id
router.get("/byTeacher/:id", validateJWT, getExamsById);

//* Creating an exam
router.post("/createExam", validateJWT, createExam);

//* Deleting an exam by id
router.delete("/deleteExam/:id", validateJWT, deleteExam);

//* Verifying an exam
router.post("/verifyExam/:id", validateJWT, verifyExam);

export default router;
