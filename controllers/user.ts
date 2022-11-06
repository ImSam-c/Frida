import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { reqID } from "../interfaces/interfaces";
import User from "../models/user";
import { newJWT } from "../helpers/generateJWT";
import bcryptjs from "bcryptjs";

const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find({ state: true });
  users ? res.json({ users }) : res.json({ msg: "There aren't users" });
  res.end();
};

const getTeachers = async (_req: Request, res: Response) => {
  const teachers = await User.find({ state: true }).where("area").exists(true);
  teachers
    ? res.json({ teachers })
    : res.json({ msg: "There aren't teachers" });
  res.end();
};

const getStudents = async (_req: Request, res: Response) => {
  const students = await User.find({ state: true, area: null });
  students
    ? res.json({ students })
    : res.json({ msg: "There aren't students" });
  res.end();
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id, { state: true });
  user ? res.json(user) : res.json({ msg: "This user doesn't exist" });
  res.end();
};

const updateUser = async (req: Request, res: Response) => {
  let { state, ...rest } = req.body;
  const { id: idToUpdate } = req.params;
  const { id } = (req as reqID).decoded;

  if (idToUpdate !== String(id))
    return res.status(401).json({ msg: "You cannot update this user" });

  const user = await User.findById(idToUpdate);
  if (!user)
    return res
      .status(401)
      .json({ msg: "This user doesn't exist", id: "userdx" });

  if (rest.email) rest.email = rest.email.toLowerCase();
  if (rest.password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(rest.password, salt);
  }

  await User.findByIdAndUpdate(id, rest);
  user
    ? res.json({})
    : res.json({ msg: "This user doesn't exist", id: "userdx" });
  res.end();
};

const deleteUser = async (req: Request, res: Response) => {
  const { id: idToDelete } = req.params;
  const { id } = (req as reqID).decoded;

  const user = await User.findById(idToDelete);
  if (!user) return res.status(401).json({ msg: "This user doesn't exist" });

  if (idToDelete !== String(id))
    return res.status(401).json({ msg: "You cannot delete this user" });

  await User.findByIdAndUpdate(idToDelete, { state: false });

  res.json({ msg: "user deleted" });
  res.end();
};

const recoverPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email, state: true });
  if (!user)
    return res
      .status(400)
      .json({ msg: "A user with this email doesn't exist", id: "userdx" });

  //* Creating new JWT and sending mail
  try {
    const tkn = await newJWT(user._id, "10m");
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 25,
      secure: false,
      auth: {
        user: "noreply.frida@gmail.com",
        pass: "xckjuynqvwjmjjrs",
      },
    });

    await transporter.sendMail({
      from: "noreply.frida@gmail.com",
      to: email,
      subject: "Recovering password",
      text: `Did you not request a password change? We recommend you to change it.\nTo recover your password join in this link: http://localhost:5000/../reset-password/index.html?temptKNrecvg=${tkn}
      
      Important: This link contains a secret key, expires in 10 minutes.`,
    });
    return res.json({ msg: "sent" });
  } catch (error) {
    console.log(error);
    res.end();
  }
};

export {
  getUsers,
  getTeachers,
  getStudents,
  getUserById,
  updateUser,
  deleteUser,
  recoverPassword,
};
