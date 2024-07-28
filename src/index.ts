// Importing necessary modules and components
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  TextMessage,
  ImageMessage,
  MessageFactory,
  ImageMessageFactory,
} from "./factories/MessageFactory";
import { MessageBuilder } from "./builders/MessageBuilder";
import { MessagePrototype } from "./prototypes/MessagePrototype";
import { CensoringDecorator } from "./decorators/CensoringDecorator";
import { ChatThread } from "./composites/ChatThread";
import { ChatRoomProxy, RealChatRoom } from "./proxies/ChatRoomProxy";
import { ChatMediator } from "./mediators/ChatMediator";
import { DirectSendMessageStrategy } from "./strategies/MessageStrategy";
const app = express();
const server = createServer(app);
const io = new Server(server);

const rooms: Record<string, ChatThread> = {};
const mediator = new ChatMediator();
const roomMessages: Record<string, any[]> = {}; // Store chat history for each room

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.emit("room list", Object.keys(rooms));

  socket.on("create room", (roomName: string) => {
    if (roomName && !rooms[roomName]) {
      rooms[roomName] = new ChatThread();
      roomMessages[roomName] = [];
      io.emit("room list", Object.keys(rooms));
    }
  });

  socket.on("join room", (room: string) => {
    if (rooms[room]) {
      const chatRoom = new ChatRoomProxy(new RealChatRoom());
      chatRoom.join(socket.id);
      rooms[room].addUser(socket.id); // Ensure this method correctly adds the user to the room
      socket.join(room); // Make sure the user is actually joining the room
      console.log(`User ${socket.id} joined room: ${room}`);

      // Send chat history to the user
      socket.emit("chat history", roomMessages[room]);
    }
  });

  socket.on("chat message", (msg: string, room: string) => {
    console.log(`Message: ${msg} from ${socket.id} in room ${room}`);
    if (rooms[room]) {
      console.log(`Room ${room} exists`);
      // Using MessageBuilder to construct the message
      const messageBuilder = new MessageBuilder();
      const builtMessage = messageBuilder
        .setContent(msg)
        .setType("text")
        .setAuthor(socket.id)
        .setTimestamp(new Date())
        .build();

      // Clone the message using MessagePrototype
      const prototype = new MessagePrototype(builtMessage);
      const clonedMessage = prototype.clone();

      const censoredMessage = new CensoringDecorator(clonedMessage);
      const messageStrategy = new DirectSendMessageStrategy();

      messageStrategy.send(censoredMessage);

      rooms[room].addMessage(censoredMessage);

      const message = {
        content: censoredMessage.content,
        room: room,
        author: socket.id,
        type: "text",
        timestamp: new Date(),
      };
      roomMessages[room].push(message);

      io.to(room).emit("chat message", message);
    } else {
      socket.emit("chat message", {
        content: "Room does not exist",
        room: room,
      });
    }
  });

  socket.on("image message", (base64Image, room) => {
    console.log(`Image message from ${socket.id} in room ${room}`);
    if (rooms[room]) {
      const imageFactory = new ImageMessageFactory();
      const message = {
        content: imageFactory.createMessage(base64Image).content,
        room: room,
        author: socket.id,
        type: "image",
        timestamp: new Date(),
      };

      // Store the message in the chat history
      roomMessages[room].push(message);
      rooms[room].addMessage(message);

      io.to(room).emit("image message", {
        content: base64Image,
        room: room,
        author: socket.id,
        type: "image",
        timestamp: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room].removeUser(socket.id);
      if (rooms[room].isEmpty()) {
        delete rooms[room];
        delete roomMessages[room];
      }
    }
    io.emit("room list", Object.keys(rooms));
    console.log("User disconnected");
  });

  socket.on("typing", (data) => {
    const { room } = data;
    console.log(`User ${socket.id} is typing in room ${room}`);
    if (rooms[room]) {
      io.to(room).emit("typing", { author: socket.id, room });
      console.log(`bERASIL `);
    } else {
      console.log(`Room ${room} does not exist`);
    }
  });

  socket.on("stop typing", (data) => {
    const { room } = data;
    if (rooms[room]) {
      io.to(room).emit("stop typing", { author: socket.id, room });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
