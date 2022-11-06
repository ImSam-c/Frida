"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const validationResult_1 = require("../middlewares/validationResult");
const express_validator_1 = require("express-validator");
const dbValidations_1 = require("../helpers/dbValidations");
const validateJWT_1 = require("../middlewares/validateJWT");
const router = (0, express_1.Router)();
//* Getting all users
router.get("/", user_1.getUsers);
//* Getting all teachers
router.get("/teachers", user_1.getTeachers);
//* Getting all students
router.get("/students", user_1.getStudents);
//* Getting user by id
router.get("/:id", user_1.getUserById);
//* Updating user by id
router.put("/updateUser/:id", [validateJWT_1.validateJWT, (0, express_validator_1.check)("email").custom(dbValidations_1.emailExists), validationResult_1.validate], user_1.updateUser);
//* Deleting user by id
router.delete("/:id", validateJWT_1.validateJWT, user_1.deleteUser);
//* Recovering password
router.put("/recoverPassword", user_1.recoverPassword);
exports.default = router;
