const socket = io("http://localhost:3002"); // Connect to server

var redPlayer = "R";
var yellowPlayer = "Y";
var finish = false;
var board;
var rows = 6;
var columns = 7;
var currentColumn;
var currentPlayer = redPlayer; // Default to red

// Load the board when the window loads
window.onload = function () {
    gameStart();
};

// Function to initialize the board
function gameStart() {
    board = [];
    currentColumn = [5, 5, 5, 5, 5, 5, 5]; // Reset column tracking

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(" ");

            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", placePiece);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

// Function that allows placing pieces
function placePiece() {
    if (finish) return;

    let coords = this.id.split("-");
    let c = parseInt(coords[1]);

    let r = currentColumn[c]; // Get lowest available row
    if (r < 0) return; // Column is full

    // Send move to server with column index
    socket.emit("move", { col: c });
}

// Listen for updated board state from the server
socket.on("updateBoard", (gameState) => {
    board = gameState.board;
    currentColumn = gameState.currentColumn; // Update currentColumn
    currentPlayer = gameState.currentPlayer; // Update player turn

    // Update board UI
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.classList.remove("red-piece", "yellow-piece");

            if (board[r][c] === "R") {
                tile.classList.add("red-piece");
            } else if (board[r][c] === "Y") {
                tile.classList.add("yellow-piece");
            }
        }
    }

    // Check for a winner
    checkWinner();
});

// Function to check for win conditions
function checkWinner() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== " " &&
                board[r][c] === board[r][c + 1] &&
                board[r][c + 1] === board[r][c + 2] &&
                board[r][c + 2] === board[r][c + 3]) {
                setWinner(r, c);
                return;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] !== " " &&
                board[r][c] === board[r + 1][c] &&
                board[r + 1][c] === board[r + 2][c] &&
                board[r + 2][c] === board[r + 3][c]) {
                setWinner(r, c);
                return;
            }
        }
    }

    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== " " &&
                board[r][c] === board[r - 1][c + 1] &&
                board[r - 1][c + 1] === board[r - 2][c + 2] &&
                board[r - 2][c + 2] === board[r - 3][c + 3]) {
                setWinner(r, c);
                return;
            }
        }
    }

    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== " " &&
                board[r][c] === board[r + 1][c + 1] &&
                board[r + 1][c + 1] === board[r + 2][c + 2] &&
                board[r + 2][c + 2] === board[r + 3][c + 3]) {
                setWinner(r, c);
                return;
            }
        }
    }
}

// Function that determines the winner
function setWinner(r, c) {
    let winner = document.getElementById("winner");
    if (board[r][c] === redPlayer) {
        winner.innerText = "Red Player Wins!";
        winner.style.color = "Red";
    } else {
        winner.innerText = "Yellow Player Wins!";
        winner.style.color = "Yellow";
    }
    finish = true;
}
