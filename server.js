const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    transports: ["websocket", "polling"],
});

const PORT = 3002;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Game state
let gameState = {
    board: Array(6).fill(null).map(() => Array(7).fill(" ")), // 6x7 grid
    currentColumn: [5, 5, 5, 5, 5, 5, 5], // Tracks next available row per column
    currentPlayer: "R", // Red starts first
};

// Handle socket connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Send the current game state to the new player
    socket.emit("updateBoard", gameState);

    socket.on("move", (data) => {
        const { col } = data;
        let row = gameState.currentColumn[col]; // Get the lowest available row in the column
        const player = gameState.currentPlayer;

        if (row < 0) return; // Column is full, ignore move

        // Place piece in the lowest available row
        gameState.board[row][col] = player;
        
        // Update currentColumn to point to the next available row
        gameState.currentColumn[col] -= 1; 

        // Switch turns before broadcasting
        gameState.currentPlayer = player === "R" ? "Y" : "R";

        // Broadcast updated game state
        io.emit("updateBoard", gameState);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
