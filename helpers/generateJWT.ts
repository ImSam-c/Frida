import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const newJWT = (
  id: Types.ObjectId,
  name: string,
  email: string,
  area?: string,
  img?: string,
  exp: string = "12h"
) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id, name, email, area, img },
      process.env.SECRETORPRIVATEKEY || "",
      {
        expiresIn: exp,
      },
      (err, token) => {
        err ? reject(`The JWT could not be generated: ${err}`) : resolve(token);
      }
    );
  });
};
