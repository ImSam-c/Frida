import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

import User from "../models/user";
import { reqBody, userI } from "../interfaces/interfaces";
import { newJWT } from "../helpers/generateJWT";

const register = (req: Request, res: Response): void => {
  let { name, lastname, password, email, area }: reqBody = req.body;
  let fullname = `${name} ${lastname}`;
  email = email.toLowerCase();

  const salt = bcryptjs.genSaltSync();
  password = bcryptjs.hashSync(password, salt);

  if (area) {
    const user = new User<userI>({
      fullname,
      password,
      email,
      area,
    });
    res.status(201).json({ user });
    user.save();
  } else {
    const user = new User<userI>({
      fullname,
      password,
      email,
    });
    res.status(201).json({ user });
    user.save();
  }

  res.end();
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  //Verifying email
  const user = await User.findOne({ email, state: true });

  if (!user) return res.status(400).json({ msg: "This user doesn't exist" });

  //Verifying password
  const passwordMatch: boolean = bcryptjs.compareSync(password, user.password);

  if (!passwordMatch)
    return res.status(401).json({ msg: "Incorrect credentials" });

  const jwt = await newJWT(user._id).catch((err) => {
    throw new Error(err);
  });
  return res.json({ user, jwt });
};

export { register, login };
