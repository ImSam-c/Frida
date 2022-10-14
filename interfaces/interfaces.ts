import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

interface userI {
  fullname: string;
  password: string;
  email: string;
  area?: string;
  state?: boolean;
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
