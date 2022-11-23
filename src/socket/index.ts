import { ObjectId } from "mongoose";
import { Message } from "../api/chats/types";
import chatsModel from "../api/chats/model";
interface Users {
  id: ObjectId;
  userName: string;
}
interface Chat {
  senderId: ObjectId;
  receiverId: ObjectId;
}

const OnlineUsers: Users[] = [];
const messages: Message[] = [];
const chats: Chat[] = [];

export const initialConnectionHandler = (newUser: any) => {
  newUser.on("connect", (payload: Users) => {
    OnlineUsers.push({
      id: payload.id,
      userName: payload.userName,
    });
  });
  newUser.on("newChat", (payload: Chat) => {
    chats.push({
      senderId: payload.senderId,
      receiverId: payload.receiverId,
    });
  });
  newUser.emit("checkChats", (payload: Chat) => {
    chats.some((user) => {
      user.receiverId === payload.receiverId &&
        user.senderId === payload.senderId;
    });
  });

  newUser.emit("signedIn", OnlineUsers);
  newUser.broadcast.emit("newConnection", OnlineUsers);

  newUser.on("disconnect", () => {
    OnlineUsers.filter((user) => {
      user.id !== newUser.id;
    });
  });

  newUser.on("sendMessage", (message: Message) => {
    newUser.broadcast.emit("newMessage", (message: Message) => {
      messages.push({
        sender: message.sender,
        content: message.content,
        timestamp: message.timestamp,
      });
      return message;
    });
  });
};
