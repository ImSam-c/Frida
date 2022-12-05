import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { UploadedFile } from "express-fileupload";

interface userI {
  fullname: string;
  password: string;
  email: string;
  area?: string;
  state?: boolean;
  img?: string;
}

interface question {
  statement: string;
  options: [string, string, string, string];
  correctAnswer: number;
}

interface examI {
  area: string;
  byTeacher: Types.ObjectId;
  questions: question[];
  nQuestions: number;
  comments?: string;
}

interface reqBody {
  name: string;
  lastname: string;
  password: string;
  email: string;
  area: string;
}

interface CustomRequest extends Request {
  id?: string | JwtPayload;
  user?: userI;
  decoded?: string | JwtPayload | { id: Types.ObjectId };
}

interface reqID extends Request {
  decoded: { id: Types.ObjectId };
}

export { userI, examI, reqBody, CustomRequest, reqID, question };
