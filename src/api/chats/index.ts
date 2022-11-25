import express from "express";
import UsersModel from "../users/model";
import { JwtAuthenticationMiddleware, UserRequest } from "../../lib/jwtAuth";
import  ChatsModel  from "./model";
import createHttpError from "http-errors";

const chatsRouter = express.Router();

// INITIAL CHATS REQUEST (check if chat exists)
// chatsRouter.get("/:receiverId", JwtAuthenticationMiddleware,async (req: UserRequest,res,next) => {
//   try {
//       const chat = await ChatsModel.find(
//         { members: { $all: [ req.user?._id , req.params.receiverId  ] } }
//       )
//       if(chat){
//         res.send({message: "this people have a chat between them"})
//       }else{
//         res.send({message: "this people do not have chat between them"})
//       }
    
//   } catch (error) {
//     next(error)
//   }
// })


// GET all chats I'm a part of

chatsRouter.get(
  "/",
  JwtAuthenticationMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      
      
      if (req.user) {
        const user = await UsersModel.findById(req.user._id);
        if (user) {
            res.send(user.chats)
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

// Create a chat with other participant(s)

chatsRouter.post("/", JwtAuthenticationMiddleware, async (req, res, next) => {
  try {
    const chatObject = {
        members: [...req.body],
        messages: []
    }
    
    const newChat = new ChatsModel(chatObject)
    newChat.save()
    res.status(201).send(newChat)
  } catch (error) {
    next(error);
  }
});

// GET full message history for specific chat

chatsRouter.get("/:id", JwtAuthenticationMiddleware, async (req, res, next) => {
  try {
    const chat = await ChatsModel.findById(req.params.id).populate('members')
    console.log(chat)
    if(chat){
      res.send(chat)
    }else{
      createHttpError(404, `chat with the id ${req.params.id} not found`)
    }
  } catch (error) {
    next(error);
  }
});

export default chatsRouter;
