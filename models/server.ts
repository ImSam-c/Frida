import express, { Application } from "express";
import fileUpload from "express-fileupload";

import cors from "cors";
import authRouter from "../routes/authentication";
import examRouter from "../routes/exam";
import userRouter from "../routes/user";
import uploadsRouter from "../routes/uploads";
import notFoundRouter from "../routes/404";

import { dbConnection } from "../db/connection";

export class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    auth: "/api/auth",
    exams: "/api/exams",
    users: "/api/users",
    uploads: "/api/upload",
    notFound: "*",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8090";

    this.middlewares();
    this.routes();
    this.connectDB();
  }

  middlewares() {
    //CORS
    this.app.use(
      cors({
        origin: "https://frida.up.railway.app",
      })
    );

    //Parse body
    this.app.use(express.json());

    //Static content
    this.app.use(express.static("./public"));

    //FileUpload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        limits: {
          fileSize: 3 * 1024 * 1024,
          files: 1,
        },
      })
    );
  }

  routes() {
    this.app.use(this.apiPaths.auth, authRouter);
    this.app.use(this.apiPaths.exams, examRouter);
    this.app.use(this.apiPaths.users, userRouter);
    this.app.use(this.apiPaths.uploads, uploadsRouter);
    this.app.use(this.apiPaths.notFound, notFoundRouter);
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
