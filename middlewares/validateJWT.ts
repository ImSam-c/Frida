import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user";
import { secretOrPrivateKey } from "../helpers/variables";
import { CustomRequest } from "../interfaces/interfaces";

export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenAuth = req.header("authorization")?.replace("Bearer ", "");

  if (!tokenAuth)
    return res
      .status(401)
      .json({ msg: "You must provide an authentication token" });

  try {
    const decoded = jwt.verify(
      tokenAuth,
      process.env.secretOrPrivateKey || secretOrPrivateKey
    );

    (req as CustomRequest).decoded = decoded;
    const { id } = decoded as CustomRequest;

    //Getting user from payload of the JWT
    const user = await User.findById(id, { state: true });

    if (!user) return res.status(400).json({ msg: "This user doesn't exist" });

    (req as CustomRequest).user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Invalid token, use a valid token",
      id: "it",
    });
  }
};
