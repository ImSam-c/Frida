"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../routes/authentication"));
const connection_1 = require("../db/connection");
class Server {
    constructor() {
        this.apiPaths = {
            auth: "/api/auth",
            teachers: "/api/teachers",
            students: "/api/students",
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "7000";
        this.middlewares();
        this.routes();
        this.connectDB();
    }
    middlewares() {
        //Static content
        this.app.use(express_1.default.static("public"));
        //Parse body
        this.app.use(express_1.default.json());
    }
    routes() {
        this.app.use(this.apiPaths.auth, authentication_1.default);
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
