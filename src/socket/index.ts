import { ObjectId } from "mongoose";
import { Message } from "../api/chats/types";
import ChatsModel from "../api/chats/model";
import { User } from "../api/users/types";

interface Users {
  id: ObjectId;
  socketId: string;
  userName: string;
}

interface UsernameWithId {
  username: string;
  _id: ObjectId;
}

// Array of online users at any time
const OnlineUsers: Users[] = [];

export const initialConnectionHandler = (newUser: any) => {
  // USER CONNECTS
  console.log("SocketId: ", newUser.id);

  newUser.emit("signedIn", OnlineUsers);
  // FRONTEND SENDS CONNECT AND WE ADD THEM TO 'ONLINE USERS ARRAY'
  // Expects payload of {username, _id}
  newUser.on("connect", (payload: UsernameWithId) => {
    OnlineUsers.push({
      id: payload._id,
      socketId: newUser.id,
      userName: payload.username,
    });
  });
  newUser.broadcast.emit("newConnection", OnlineUsers);


  // User sends potential participants to here with 'checkChats' event to chat if there is already a chat with them
  // Expects payload of array of User Id's []

  newUser.on("checkChats", async (payload: ObjectId[]) => {
    const chats = await ChatsModel.find({ members: payload }); //INSIDE HERE NEEDS MONGOOSE QUERY TERMS TO FIND ALL CHATS THAT HAVE PARTICIPANTS EXACTLY EQUAL TO PAYLOAD PARTICIPANT ARRAY
    const chatIds = chats.map((chat) => {
      chat._id;
    });
    if (chats) {
      // If there is an existing chat, sends back chat ID so frontend can get the specific messages of the chat using the ID and endpoint
      newUser.emit("existingChat", chatIds);
    } else {
      // If there is no existing chat, tells frontend to make new chat in DB using endpoint
      newUser.emit("noExistingChat", chats);
    }
  });

  // Frontend sends 'openChat' event after the previous chat has been loaded or a new chat has been created with http POST
  // Expects payload of newly created chat Id

  newUser.on("openChat", (payload: ObjectId) => {
    const roomId: ObjectId = payload;

    // Temporary messages array for each room
    const messages: Message[] = [];

    // Create room here with participating users (you'll get all user id's from frontend in array in payload)
    newUser.join(roomId);
    // ON FRONTED, ALL USERS WILL JOIN HERE TOO

    newUser.on("sendMessage", (message: Message) => {
      // Adds new message into temporary 'messages' array
      console.log(message)
      console.log('hello')
      messages.push({
        sender: message.sender,
        content: message.content, // {text: TEXT-STRING, media: MEDIA-STRING}
        timestamp: message.timestamp,

      });

      // Broadcasts message to rest of users in room
      newUser.to(roomId).broadcast.emit("newMessage", message);
    });

    newUser.on("disconnect", () => {
      OnlineUsers.filter((user) => {
        user.id !== newUser.id;
      });

      // Load specific created chat from DB into variable using the 'roomId' variable
      // push and spread 'messages' array full of recent messages onto the end of the 'messages' array in the DB chat object
      // Update using mongoose methods
    });
  });
};
