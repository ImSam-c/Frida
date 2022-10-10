import { config } from "dotenv";
config();
import { Server } from "./models/server";

const server: Server = new Server();
server.listen();
