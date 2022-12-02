import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { secretOrPrivateKey } from "./variables";

export const newJWT = (
  id: Types.ObjectId,
  name: string,
  email: string,
  area?: string,
  exp: string = "12h"
) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id, name, email, area },
      process.env.SECRETORPRIVATEKEY || secretOrPrivateKey,
      {
        expiresIn: exp,
      },
      (err, token) => {
        err ? reject(`The JWT could not be generated: ${err}`) : resolve(token);
      }
    );
  });
};
