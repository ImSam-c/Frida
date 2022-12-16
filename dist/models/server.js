"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const authentication_1 = __importDefault(require("../routes/authentication"));
const exam_1 = __importDefault(require("../routes/exam"));
const user_1 = __importDefault(require("../routes/user"));
const uploads_1 = __importDefault(require("../routes/uploads"));
const connection_1 = require("../db/connection");
class Server {
    constructor() {
        this.apiPaths = {
            auth: "/api/auth",
            exams: "/api/exams",
            users: "/api/users",
            uploads: "/api/upload",
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "8090";
        this.middlewares();
        this.routes();
        this.connectDB();
    }
    middlewares() {
        //CORS
        this.app.use((0, cors_1.default)({
            origin: "frida.up.railway.app",
        }));
        //Parse body
        this.app.use(express_1.default.json());
        //Static content
        this.app.use(express_1.default.static("./public"));
        //FileUpload
        this.app.use((0, express_fileupload_1.default)({
            useTempFiles: true,
            tempFileDir: "/tmp/",
            limits: {
                fileSize: 3 * 1024 * 1024,
                files: 1,
            },
        }));
    }
    routes() {
        this.app.use(this.apiPaths.auth, authentication_1.default);
        this.app.use(this.apiPaths.exams, exam_1.default);
        this.app.use(this.apiPaths.users, user_1.default);
        this.app.use(this.apiPaths.uploads, uploads_1.default);
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
