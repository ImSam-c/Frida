import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { UploadedFile } from "express-fileupload";
import User from "../models/user";
import { reqID } from "../interfaces/interfaces";
import { newJWT } from "../helpers/generateJWT";

if (process.env.CLOUDINARY_URL) cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFile = async (req: Request, res: Response) => {
  const file: UploadedFile = req.files!.file as UploadedFile;
  const { id } = (req as reqID).decoded;

  try {
    const path: string = file.tempFilePath;

    const { secure_url } = await cloudinary.uploader.upload(path, {
      folder: "Frida",
    });

    const user = await User.findByIdAndUpdate(
      id,
      { img: secure_url },
      {
        returnDocument: "after",
      }
    );

    if (user)
      res.json({
        jwt: await newJWT(
          user._id,
          user.fullname,
          user.email,
          user.area,
          user.img
        ),
      });
    else res.status(400).json({ msg: "This user doesn't exist", id: "userdx" });
  } catch (error) {
    console.log(error);
  }

  // const { tempFilePath } = req.files.archivo;
  // const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  // console.log({ secure_url });

  res.end();
};

export { uploadFile };
