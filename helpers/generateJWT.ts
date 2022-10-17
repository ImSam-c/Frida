import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { secretOrPrivateKey } from "./variables";

export const newJWT = (id: Types.ObjectId, exp: string = "12h") => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id },
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
