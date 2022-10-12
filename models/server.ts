import express, { Application } from "express";
import teacherRouter from "../routes/teacherRoute";
import authRouter from "../routes/authentication";
import { dbConnection } from "../db/connection";

export class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    auth: "/api/auth",
    teachers: "/api/teachers",
    students: "/api/students",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "7000";

    this.middlewares();
    this.routes();
    this.connectDB();
  }

  middlewares() {
    //Static content
    this.app.use(express.static("public"));

    //Parse body
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.apiPaths.auth, authRouter);
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
