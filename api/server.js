const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors: {origin: "*"}});

const rooms = {};

/**
 * Generates a random room code.
 * @returns {*|string} A random room code.
 */
const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    return rooms[code] ? generateRoomCode() : code;
}

/**
 * Returns the room code of the room the socket is in.
 * @param socketId The socket id of the socket.
 * @returns {string} The room code of the room the socket is in.
 */
const getRoomCodeBySocketId = (socketId) => {
    return Object.keys(rooms).find((code) => rooms[code].host === socketId || rooms[code].players.some((player) => player.id === socketId));
}

/**
 * Returns the name of the player with the given socket id in the given room.
 * @param socketId The socket id of the player.
 * @param roomCode The room code of the room the player is in.
 * @returns {*|null} The name of the player with the given socket id in the given room.
 */
const getPlayerName = (socketId, roomCode) => {
    const player = rooms[roomCode].players.find((player) => player.id === socketId);
    return player ? player.name : null;
}

io.on("connection", (socket) => {
    socket.on("CREATE_ROOM", (data, callback = () => {}) => {
        if (getRoomCodeBySocketId(socket.id)) {
            callback(false);
            return;
        }

        const code = generateRoomCode();
        rooms[code] = {host: socket.id, players: []};

        callback({code});

        console.log(`Room ${code} created by ${socket.id}.`);

        socket.join(code);
    });

    socket.on("JOIN_ROOM", (data, callback = () => {}) => {
        if (getRoomCodeBySocketId(socket.id)) {
            callback(false);
            return;
        }

        const {code, name} = data;

        if (!code || !name) {
            callback(false);
            return;
        }

        if (rooms[code]) {
            socket.join(code);
            rooms[code].players.push({id: socket.id, name});
            io.to(rooms[code].host).emit("JOINED", {id: socket.id, name});
            callback(true);
        } else {
            callback(false);
        }
    });

    socket.on("SUBMISSION_READY", (data, callback = () => {}) => {
        const roomCode = getRoomCodeBySocketId(socket.id);
        io.to(roomCode).emit("SUBMISSION_READY");

        callback(true);
    });

    socket.on("SUBMIT", (data, callback = () => {}) => {
        const {price, amount} = data;

        if (price === undefined || amount === undefined) {
            callback(false);
            return;
        }

        if (price < 0 || price > 10000 || amount < 0 || amount > 20) {
            callback(false);
            return;
        }

        const roomCode = getRoomCodeBySocketId(socket.id);
        const playerName = getPlayerName(socket.id, roomCode);

        io.to(rooms[roomCode].host).emit("RECEIVED", {id: socket.id, name: playerName, price, amount});
        callback(true);
    });

    socket.on("UPDATE_CAPITAL", (data, callback = () => {}) => {
        const {id, capital} = data;

        if (!id || capital === undefined) {
            callback(false);
            return;
        }

        io.to(id).emit("CAPITAL", {capital});

        if (capital < 5000) {
            socket.emit("LEFT", {id: socket.id});
            io.sockets.sockets.get(id).disconnect();
        }

        callback(true);
    });

    socket.conn.on("close", () => {
        const roomCode = getRoomCodeBySocketId(socket.id);

        if (!roomCode) return;

        rooms[roomCode].players = rooms[roomCode].players.filter((player) => player.id !== socket.id);
        if (rooms[roomCode].host === socket.id) {
            for (const player of rooms[roomCode].players) io.sockets.sockets.get(player.id).disconnect();

            delete rooms[roomCode];
        } else {
            io.to(rooms[roomCode].host).emit("LEFT", {id: socket.id});
        }

    });
});

httpServer.listen(3000, () => {
    console.log("listening on *:3000");
});