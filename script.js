// Connects to the server!
// Port 3000 sends the page to a "No Server Root" page.
// Port 3001 sends the page to a page with the text saying "upgrade required"
const socket = io("http://localhost:3002");

// Variables, lots of them.
var redPlayer = "R";
var yellowPlayer = "Y";
var finish = false;
var board;
var rows = 6;
var columns = 7;
var currentColumn;
var currentPlayer = redPlayer; // Sets default player to the red chip.

// Loads the board when the window loads
window.onload = function () {
    gameStart();
};

// Function to initialize the board
function gameStart() {
    board = [];
    currentColumn = [5, 5, 5, 5, 5, 5, 5];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(" ");
            
            // It's the equivalent of making div elements in HTML, saves time and readibility.
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", placePiece);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

// Function that allows players to place pieces, or "chips" as commonly called, I think.
function placePiece() {
    if (finish) return;     // Ends the game, makes it so players are unable to place chips.

    let coords = this.id.split("-");
    let c = parseInt(coords[1]);

    let r = currentColumn[c];
    if (r < 0) return;
    
    socket.emit("move", { col: c });       // Sends a move to the server with column index.
}

// Updates the board to the server.
socket.on("updateBoard", (gameState) => {
    board = gameState.board;
    currentColumn = gameState.currentColumn; // Updates the current column
    currentPlayer = gameState.currentPlayer; // Updates the player's turn, changing the chip color order.

    // Updates the board.
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

    // Checks for the winner.
    checkWinner();
});

// Function that checks the winning conditions.
function checkWinner() {
    // Checks for Vertical winning conditions.
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

    // Cheks for Horizontal winning conditions.
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

    // Checks for Reversed Diagonal winning conditions.
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

    // Checks for Diagonal winning conditions.
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
    finish = true;  // Once a winner is found, sets finish to true, which determines when the game has been won.
}
