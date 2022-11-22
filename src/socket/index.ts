import { ObjectId } from "mongoose";
import { UserDocument } from "../api/users/types";

interface Users {
  id: ObjectId
  userName: string
}


const OnlineUsers: Users [] = []

export const newConnection = (newUser: any) => {
  newUser.on("connect", (payload: any) => {
    OnlineUsers.push({
      id: payload._id,
      userName: payload.userName
    })
  })
  newUser.emit("signedIn", OnlineUsers)
  newUser.broadcast.emit("newConnection", OnlineUsers)

  newUser.on("disconnect", () => {
    OnlineUsers.filter((user) => {user.id !== newUser.id})
  })
  
  newUser.on("sendMessage", (message: any) => {
     newUser.broadcast.emit("newMessage", message);
    })

}
























