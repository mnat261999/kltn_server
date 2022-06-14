require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SocketServer = require('./socketServer')

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());


//Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
  SocketServer(socket)
})

// Routes
app.use("/api/user", require("./routes/userRouter"));
app.use("/api/upload", require("./routes/uploadRouter"));
app.use("/api/avatar", require("./routes/avatarRouter"));
app.use("/api/cover", require("./routes/coverRouter"));
app.use("/api/post", require("./routes/postRouter"));
app.use("/api/comment", require("./routes/commentRouter"));



const URI = process.env.MONGODB_URL;

mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to mongodb");
  }
);

const port = process.env.PORT || 2000;
http.listen(port, () => {
  console.log("Server is running on port", port);
});
