import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { secretOrPrivateKey } from "./variables";

export const newJWT = (id: Types.ObjectId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id },
      process.env.SECRETORPRIVATEKEY || secretOrPrivateKey,
      {
        expiresIn: "12h",
      },
      (err, token) => {
        err ? reject(`The JWT could not be generated: ${err}`) : resolve(token);
      }
    );
  });
};
