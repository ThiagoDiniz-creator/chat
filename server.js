const http = require("http");
const { Server } = require("socket.io");
const { jwtVerify } = require("jose");
const { configDotenv } = require("dotenv");
const { Socket } = require("socket.io-client");

configDotenv();

const httpServer = http.createServer();

function getSecretKey() {
  const secretKey = process.env.JWT_SECRET_KEY;
  return new TextEncoder().encode(secretKey);
}

const io = new Server(httpServer, {
  cors: {
    origin: "http://192.168.1.121:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["token"],
    credentials: true,
  },
});

const getJwtToken = async socket => {
  try {
    const token = socket.handshake.headers?.cookie?.split("token=")[1];
    if (!token) {
      return null;
    }
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (err) {
    console.log(err.message);
    return null;
  }
};

const formatLog = (action, idChat, userId) => {
  console.log(
    `${action.toUpperCase()} - Chat: ${idChat
      .toString()
      .toUpperCase()} - User: ${userId.toString().toUpperCase()}`
  );
};

io.on("connection", async socket => {
  const user = await getJwtToken(socket);
  if (!user) {
    socket.disconnect();
    return;
  }

  socket.on("JOIN_CHAT", idChat => {
    socket.join(idChat);
    formatLog("User joined chat", idChat, user.id);
    socket.emit("USER_JOINED", idChat, user.id);
  });

  socket.on("SEND_MESSAGE", idChat => {
    formatLog("New message in", idChat, user.id);
    socket.to(idChat).emit("NEW_MESSAGE", idChat, user.id);
  });

  socket.on("TYPING", idChat => {
    formatLog("Typing", idChat, user.id);
    socket.to(idChat).emit("TYPING", idChat, user.id);
  });

  socket.on("STOP_TYPING", idChat => {
    formatLog("Stop typing", idChat, user.id);
    socket.to(idChat).emit("STOP_TYPING", idChat, user.id);
  });

  socket.on("LEAVE_CHAT", idChat => {
    formatLog("User disconnected", idChat, user.id);
    socket.to(idChat).emit("USER_LEFT", idChat, user.id);
    socket.leave(idChat);
  });

  socket.on("ALREADY_IN_CHAT", idChat => {
    formatLog("Already in chat", idChat, user.id);
    socket.to(idChat).emit("OTHER_IN_CHAT", idChat, user.id);
  });

  socket.on("VISUALIZED", idChat => {
    formatLog("Visualized", idChat, user.id);
    socket.to(idChat).emit("VISUALIZED", idChat, user.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer
  .listen({
    port: PORT,
    host: "192.168.1.121",
  })
  .on("listening", () => {
    console.log(`Socket.io server is running on port ${PORT}`);
  });
