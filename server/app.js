require("dotenv").config();
const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const conversationRouter = require('./routes/conversation');
const messageRouter = require('./routes/message');

const port = process.env.PORT || 5000

let app = express();
let server = http.createServer(app);
let io = socketIO(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
    console.log('Database connection successful');
} catch(err) {
    console.log(err);
}


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);

let users = [];

const addUser = (userId, socketId) => {
    console.log('User added', userId);
  !users.some(user => user.userId === userId) && users.push({ userId, socketId });
}

const removeUser = (socketId) => {
    console.log('User removed', socketId);
  users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
  const fetchedUser = users.filter(user => user.userId === userId);
  return fetchedUser[0];
}

io.on("connection", (socket) => {

  // connection
  console.log("A user connected");
  
  socket.on("addUser", userId => {
      addUser(userId, socket.id);
      console.log(users);
      io.emit("getUsers", users);
  });

  // send and get messages
  socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
      const user = getUser(receiverId);
      io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
          conversationId
      })
  })

  // disconnection
  socket.on("disconnect", () => {
      console.log("A user disconnected");
      removeUser(socket.id);
      io.emit("getUsers", users);
  })
});

server.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});