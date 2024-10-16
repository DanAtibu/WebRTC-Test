require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
const server = require("http").createServer(app);




const io = require("socket.io")(server, { cors: { origin: "*" } });


const USERS = {};


io.on("connection", (socket) => {
    const { username } = socket.handshake.query;


    console.log("Connected : ", username);


    socket.on("message", (message) => {
        socket.broadcast.emit("message", message);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected : ", username);
        delete USERS[username];
    });

    socket.on("offer", (payload) => {
        USERS[payload.receiver]?.emit("offer", { ...payload, sender: username });
    });

    socket.on("answer", (payload) => {
        USERS[payload.receiver]?.emit("answer", { ...payload, sender: username });
    });

    socket.on("candidate", (payload) => {
        USERS[payload.receiver]?.emit("candidate", { ...payload, sender: username });
    });



    socket.emit("ping", { message: "ping" });

    USERS[username] = socket;
});




app.use(function (err, req, res, next) {
    // log it
    if (!test) console.error(err.stack);

    // respond with 500 "Internal Server Error".
    res.status(500);
    res.send("Internal Server Error");
});




const PORT = 3333 || process.env.PORT;
server.listen(PORT, "0.0.0.0", () => console.log(`Listening on Port ${PORT}`));