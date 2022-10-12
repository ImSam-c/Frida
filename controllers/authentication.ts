import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

import User from "../models/user";
import { reqBody, userI } from "../interfaces/interfaces";

const register = (req: Request, res: Response): void => {
  let { name, lastname, password, email, area }: reqBody = req.body;
  let fullname = `${name} ${lastname}`;

  const salt = bcryptjs.genSaltSync();
  password = bcryptjs.hashSync(password, salt);

  if (area) {
    const user = new User({
      fullname,
      password,
      email,
      area,
    });
    res.status(201).json({ user });
    user.save();
  } else {
    const user = new User({
      fullname,
      password,
      email,
    });
    res.status(201).json({ user });
    user.save();
  }

  res.end();
};

const login = async (req: Request, res: Response): Promise<void> => {};

export { register, login };
