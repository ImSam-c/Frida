import { Router } from "express";
import { check } from "express-validator";
import { login, register } from "../controllers/authentication";
import { emailExists } from "../helpers/dbValidations";
import { validate } from "../middlewares/validationResult";

const router = Router();

//* Std register
router.post(
  "/register",
  [
    check("name", "The name is empty").notEmpty(),
    check("lastname", "The lastname is empty").notEmpty(),
    check("email", "The email is empty").notEmpty(),
    check("email", "Wrong email").isEmail(),
    check("email").custom(emailExists),
    check("password", "The password is empty").notEmpty(),
    check("password", "The password must be longer than 5 characters").isLength(
      { min: 6 }
    ),
    validate,
  ],
  register
);

//* Std login
router.post(
  "/login",
  [
    check("email", "The email is empty").notEmpty(),
    check("email", "Wrong email").isEmail(),
    check("password", "The password is empty").notEmpty(),
    validate,
  ],
  login
);

export default router;
