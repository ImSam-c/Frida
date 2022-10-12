"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authentication_1 = require("../controllers/authentication");
const dbValidations_1 = require("../helpers/dbValidations");
const validationResult_1 = require("../middlewares/validationResult");
const router = (0, express_1.Router)();
router.post("/register", [
    (0, express_validator_1.check)("name", "The name is empty").notEmpty(),
    (0, express_validator_1.check)("lastname", "The lastname is empty").notEmpty(),
    (0, express_validator_1.check)("email", "The email is empty").notEmpty(),
    (0, express_validator_1.check)("email", "Wrong email").isEmail(),
    (0, express_validator_1.check)("email").custom(dbValidations_1.emailExists),
    (0, express_validator_1.check)("password", "The password is empty").notEmpty(),
    (0, express_validator_1.check)("password", "The password must be longer than 5 characters").isLength({ min: 6 }),
    validationResult_1.validate,
], authentication_1.register);
// * router.post("/login", login)
exports.default = router;
