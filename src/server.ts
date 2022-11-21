import express from "express";
import cors from "cors";
import {
  forbiddenErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandeler";

const server = express();

server.use(cors());
server.use(express.json());

server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);


export default server