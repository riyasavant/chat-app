const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && users.push({ userId, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    console.log(users);
    const fetchedUser = users.filter(user => user.userId === userId)
    console.log(fetchedUser);
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
        console.log(user);
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