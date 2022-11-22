import express from "express";
import { JwtAuthenticationMiddleware } from "../../lib/jwtAuth";

const chatsRouter = express.Router();

// GET all chats I'm a part of

chatsRouter.get("/", JwtAuthenticationMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// Create a chat with other participant(s)

chatsRouter.post("/", JwtAuthenticationMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// GET full message history for specific chat

chatsRouter.get("/:id", JwtAuthenticationMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default chatsRouter;
