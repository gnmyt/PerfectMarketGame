const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {cors: {origin: "*", connectionStateRecovery: {
    maxDisconnectionDuration: 1000}}});

const rooms = {};

/**
 * Validates the provided input to create a room
 * @param data The required data
 * @param callback The callback
 * @returns {boolean} true if the provided input is valid, false otherwise
 */
const validateInput = (data, callback) => {
    if (Object.keys(data).length !== 5 && data.startCapital && data.costPerRound && data.costPerCake
        && data.maxProduction && data.maxPrice) {
        callback(false);
        return false;
    }

    try {
        [data.startCapital, data.costPerRound, data.costPerCake, data.maxProduction, data.maxPrice].forEach((value) => {
            if (value === undefined) {
                callback(false);
                return false;
            }

            const valueInt = parseInt(value);
            if (isNaN(valueInt)) {
                callback(false);
                return false;
            }
        });
    } catch (e) {
        callback(false);
        return false;
    }

    return true;
}

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

        if (Object.keys(rooms).length >= 100) {
            callback(false);
            return;
        }

        if (!validateInput(data, callback)) return;

        const code = generateRoomCode();
        rooms[code] = {host: socket.id, players: [], settings: data};

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
            socket.emit("CAPITAL", {capital: rooms[code].settings.startCapital});
            socket.emit("SETTINGS", rooms[code].settings);
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
        const roomCode = getRoomCodeBySocketId(socket.id);

        if (!roomCode) return;

        if (price === undefined || amount === undefined) {
            callback(false);
            return;
        }

        try {
            const priceInt = parseInt(price);
            const amountInt = parseInt(amount);

            if (isNaN(priceInt) || isNaN(amountInt)) {
                callback(false);
                return;
            }

            if (priceInt.toString().indexOf(".") !== -1 || amountInt.toString().indexOf(".") !== -1
                || priceInt.toString().indexOf(",") !== -1 || amountInt.toString().indexOf(",") !== -1) {
                callback(false);
                return;
            }
        } catch (e) {
            callback(false);
            return;
        }

        if (price < 0 || price > rooms[roomCode].settings.maxPrice ||
            amount < 0 || amount > rooms[roomCode].settings.maxProduction) {
            callback(false);
            return;
        }

        const playerName = getPlayerName(socket.id, roomCode);

        io.to(rooms[roomCode].host).emit("RECEIVED", {id: socket.id, name: playerName, price, amount});
        callback(true);
    });

    socket.on("UPDATE_CAPITAL", (data, callback = () => {}) => {
        const {id, capital} = data;

        if (rooms[getRoomCodeBySocketId(socket.id)].host !== socket.id) {
            callback(false);
            return;
        }

        if (!id || capital === undefined) {
            callback(false);
            return;
        }

        io.to(id).emit("CAPITAL", {capital});

        let cost = rooms[getRoomCodeBySocketId(socket.id)].settings.costPerRound
            + rooms[getRoomCodeBySocketId(socket.id)].settings.costPerCake;

        if (capital < cost) {
            socket.emit("LEFT", {id: socket.id});

            rooms[getRoomCodeBySocketId(socket.id)].players = rooms[getRoomCodeBySocketId(socket.id)].players
                .filter((player) => player.id !== socket.id);

            io.to(id).emit("GAME_OVER");
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