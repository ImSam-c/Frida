"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authentication_1 = __importDefault(require("../routes/authentication"));
const exam_1 = __importDefault(require("../routes/exam"));
const user_1 = __importDefault(require("../routes/user"));
const connection_1 = require("../db/connection");
class Server {
    constructor() {
        this.apiPaths = {
            auth: "/api/auth",
            exams: "/api/exams",
            users: "/api/users",
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "8090";
        this.middlewares();
        this.routes();
        this.connectDB();
    }
    middlewares() {
        //CORS
        this.app.use((0, cors_1.default)());
        //Parse body
        this.app.use(express_1.default.json());
        //Static content
        this.app.use(express_1.default.static("./public"));
    }
    routes() {
        this.app.use(this.apiPaths.auth, authentication_1.default);
        this.app.use(this.apiPaths.exams, exam_1.default);
        this.app.use(this.apiPaths.users, user_1.default);
        // this.app.use("/", (req, res) => {
        //   res.sendFile("../sign-in/index.html");
        // });
    }
    connectDB() {
        (0, connection_1.dbConnection)();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}
exports.Server = Server;
