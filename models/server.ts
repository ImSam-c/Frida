import express, { Application } from "express";
import cors from "cors";
import authRouter from "../routes/authentication";
import examRouter from "../routes/exam";
import userRouter from "../routes/user";
import { dbConnection } from "../db/connection";

export class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    auth: "/api/auth",
    exams: "/api/exams",
    users: "/api/users",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8090";

    this.middlewares();
    this.routes();
    this.connectDB();
  }

  middlewares() {
    //Static content
    this.app.use(express.static("public"));

    //CORS
    this.app.use(cors());

    //Parse body
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.apiPaths.auth, authRouter);
    this.app.use(this.apiPaths.exams, examRouter);
    this.app.use(this.apiPaths.users, userRouter);
  }

  connectDB() {
    dbConnection();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}
