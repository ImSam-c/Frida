"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
//* Getting all users
router.get("/", user_1.getUsers);
//* Getting all teachers
router.get("/teachers", user_1.getTeachers);
//* Getting all students
router.get("/students", user_1.getStudents);
exports.default = router;
