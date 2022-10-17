import { Router } from "express";
import {
  deleteUser,
  getStudents,
  getTeachers,
  getUserById,
  getUsers,
  recoverPassword,
  updateUser,
} from "../controllers/user";
import { validate } from "../middlewares/validationResult";
import { check } from "express-validator";
import { emailExists } from "../helpers/dbValidations";
import { validateJWT } from "../middlewares/validateJWT";

const router = Router();

//* Getting all users
router.get("/", getUsers);

//* Getting all teachers
router.get("/teachers", getTeachers);

//* Getting all students
router.get("/students", getStudents);

//* Getting user by id
router.get("/:id", getUserById);

//* Updating user by id
router.put(
  "/updateUser/:id",
  [validateJWT, check("email").custom(emailExists), validate],
  updateUser
);

//* Deleting user by id
router.delete("/:id", validateJWT, deleteUser);

//* Recovering password
router.put("/recoverPassword", recoverPassword);

export default router;
