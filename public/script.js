// Variables for javascript.
var redPlayer = "R";
var yellowPlayer = "Y";
var player = redPlayer;

var finish = false;
var board;

// Variables for the game's board.
var rows = 6;
var columns = 7;
var currentColumn;

// Loads the board and logic of the board upon window loading.
window.onload = function(){
    gameStart();
}

// Function of the board
function gameStart(){
    board = [];
    currentColumn = [5, 5, 5, 5, 5, 5, 5];

    for (let r = 0; r < rows; r++){
        let row = [];
        for (let c = 0; c < columns; c++){
            row.push(' ');
            
            // Equivalent to doing this in HTML -> <div id="0-0" class="tile"> </div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", placePiece);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

// Function that allows the placement of pieces.
function placePiece(){
    if (finish){
        return; // Ends the game, makes it unable to set more pieces.
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currentColumn[c];
    if (r < 0){
        return;
    }

    // Checks who is who, red player goes first, after that, yellow goes.
    board[r][c] = player;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (player == redPlayer){
        tile.classList.add("red-piece");
        player = yellowPlayer;
    }
    else{
        tile.classList.add("yellow-piece");
        player = redPlayer;
    }

    // This small section updates the array to not collide with other pieces.
    r -= 1;
    currentColumn[c] = r;

    // Checks if there is any winner conditions.
    checkWinner();
}

// Function to check for win conditions based on board pieces.
function checkWinner(){
    // Horizontal check
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < columns - 3; c++){
            if (board[r][c] != ' '){
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Vertical check
    for (let c = 0; c < columns; c++){
        for (let r = 0; r < rows - 3; r++){
            if (board[r][c] != ' '){
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    //Diagonal Check
    for (let r=3; r<rows; r++){
        for (let c=0; c<columns-3; c++){
            if (board[r][c] != ' '){
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    //Reverse-Diagonal Check
    for (let r=0; r<rows-3; r++){
        for (let c=0; c<columns-3; c++){
            if (board[r][c] != ' '){
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
}

// Function that determines the winner based on checkWinner()'s data.
function setWinner(r, c){
    let winner = document.getElementById("winner");
    if (board[r][c] == redPlayer) {
        winner.innerText = "Red Played Wins!";
        winner.style.color = "Red";
    }
    else {
        winner.innerText = "Yellow Player Wins!";
        winner.style.color = "Yellow";
    }
    finish = true;
}
