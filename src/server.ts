import express from "express";
import cors from "cors";
import {
  forbiddenErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandler";
import usersRouter from "./api/users";
import chatsRouter from "./api/chats";
import { Server as SocketIOServer } from "socket.io"
import { createServer } from "http" 

const server = express();

const httpServer = createServer(server)
const io = new SocketIOServer(httpServer) 



server.use(cors());
server.use(express.json());

server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

server.use("/users", usersRouter);
server.use("/chats", chatsRouter);

export default server;
