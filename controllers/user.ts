import { Request, Response } from "express";
import { reqID } from "../interfaces/interfaces";
import User from "../models/user";

const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({ state: true });
  users ? res.json({ users }) : res.json({ msg: "There isn't users" });
  res.end();
};

const getTeachers = async (req: Request, res: Response) => {
  const teachers = await User.find({ state: true }).where("area").exists(true);
  teachers ? res.json({ teachers }) : res.json({ msg: "There isn't teachers" });
  res.end();
};

const getStudents = async (req: Request, res: Response) => {
  const students = await User.find({ state: true, area: null });
  students ? res.json({ students }) : res.json({ msg: "There isn't students" });
  res.end();
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id, { state: true });
  user ? res.json(user) : res.json({ msg: "This user doesn't exist" });
  res.end();
};

const updateUser = async (req: Request, res: Response) => {
  let { fullname, email } = req.body;
  const { id: idToUpdate } = req.params;
  const { id } = (req as reqID).decoded;

  if (idToUpdate !== String(id))
    return res.status(401).json({ msg: "You cannot update this user" });

  const user = await User.findById(idToUpdate);
  if (!user) return res.status(401).json({ msg: "This user doesn't exist" });

  if (email) email = email.toLowerCase();

  await User.findByIdAndUpdate(id, {
    fullname,
    email,
  });
  user
    ? res.json({ msg: "Everything is ok" })
    : res.json({ msg: "This user doesn't exist" });
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

export {
  getUsers,
  getTeachers,
  getStudents,
  getUserById,
  updateUser,
  deleteUser,
};
