"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverPassword =
  exports.deleteUser =
  exports.updateUser =
  exports.getUserById =
  exports.getStudents =
  exports.getTeachers =
  exports.getUsers =
    void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_1 = __importDefault(require("../models/user"));
const generateJWT_1 = require("../helpers/generateJWT");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsers = (_req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({ state: true });
    users ? res.json({ users }) : res.json({ msg: "There aren't users" });
    res.end();
  });
exports.getUsers = getUsers;
const getTeachers = (_req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const teachers = yield user_1.default
      .find({ state: true })
      .where("area")
      .exists(true);
    teachers
      ? res.json({ teachers })
      : res.json({ msg: "There aren't teachers" });
    res.end();
  });
exports.getTeachers = getTeachers;
const getStudents = (_req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const students = yield user_1.default.find({ state: true, area: null });
    students
      ? res.json({ students })
      : res.json({ msg: "There aren't students" });
    res.end();
  });
exports.getStudents = getStudents;
const getUserById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.default.findOne({ _id: id, state: true });
    user ? res.json(user) : res.json({ msg: "This user doesn't exist" });
    res.end();
  });
exports.getUserById = getUserById;
const updateUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let rest = __rest(req.body, []);
    const { id: idToUpdate } = req.params;
    const { id } = req.decoded;
    if (idToUpdate !== String(id))
      return res.status(401).json({ msg: "You cannot update this user" });
    let user = yield user_1.default.findById(idToUpdate);
    if (!user)
      return res
        .status(401)
        .json({ msg: "This user doesn't exist", id: "userdx" });
    if (rest.email) rest.email = rest.email.toLowerCase();
    if (rest.password) {
      const salt = bcryptjs_1.default.genSaltSync();
      rest.password = bcryptjs_1.default.hashSync(rest.password, salt);
    }
    user = yield user_1.default.findByIdAndUpdate(id, rest, {
      returnDocument: "after",
    });
    const jwt = yield (0, generateJWT_1.newJWT)(
      user._id,
      user.fullname,
      user.email,
      user.area
    ).catch((err) => {
      throw new Error(err);
    });
    res.json({ jwt });
  });
exports.updateUser = updateUser;
const deleteUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id: idToDelete } = req.params;
    const { id } = req.decoded;
    const user = yield user_1.default.findById(idToDelete);
    if (!user)
      return res
        .status(401)
        .json({ msg: "This user doesn't exist", id: "userdx" });
    if (idToDelete !== String(id))
      return res.status(401).json({ msg: "You cannot delete this user" });
    yield user_1.default.findByIdAndUpdate(idToDelete, { state: false });
    res.json({ msg: "user deleted" });
    res.end();
  });
exports.deleteUser = deleteUser;
const recoverPassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_1.default.findOne({ email, state: true });
    if (!user)
      return res
        .status(400)
        .json({ msg: "A user with this email doesn't exist", id: "userdx" });
    //* Creating new JWT and sending mail
    try {
      const tkn = yield (0, generateJWT_1.newJWT)(
        user._id,
        user.fullname,
        email,
        undefined,
        "10m"
      );
      let transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 25,
        secure: false,
        auth: {
          user: "noreply.frida@gmail.com",
          pass: process.env.SMTP_PASS,
        },
      });
      yield transporter.sendMail({
        from: "noreply.frida@gmail.com",
        to: email,
        subject: "Recovering password",
        html: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body style="text-align: center;
    color: rgba(0, 0, 0, 0.8);
    font-family: 'Courier New', Courier, monospace">
  <h1>Recovering password</h1>
  <h2>Did you not request a password change? We recommend
    you to change it.</h2>
  <a style="text-decoration: none;
    padding: .8rem;
    background-color: #157070;
    color: white;" href="https://frida.up.railway.app/../reset-password/index.html?temptKNrecvg=${tkn}">Recover</a>

  <h3>Click in this button to recover your password</h3>
  <h3>Important: This button expires in 10 minutes.</h2>
</body>

</html>`,
      });
      return res.json({ msg: "sent" });
    } catch (error) {
      console.log(error);
      res.end();
    }
  });
exports.recoverPassword = recoverPassword;
