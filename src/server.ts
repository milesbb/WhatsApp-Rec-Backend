import express from "express";
import cors from "cors";
import {
  forbiddenErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandler";
import usersRouter from "./api/users";

const server = express();

server.use(cors());
server.use(express.json());

server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

server.use("/users", usersRouter)


export default server