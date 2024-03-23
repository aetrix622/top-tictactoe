const ToeGame = (function() {
    // Player variables
    let p1, p2, currentPlayer;
    let winner = false;
    let draw = false;
    
    const GameBoard = (function() {
        // create an array for the gameboard. For each square,
        // add a square object. The board will be indexed as follows:
        // 0 1 2
        // 3 4 5
        // 6 7 8
        const board = [];
        for (let i = 0; i < 9; i++) {
            board.push(Square(i));
        }

        function loadDebugBoard() {
            const debugBoard = [
                "X", "O", "O",
                "O", "X", "X",
                "X", "O", "O"
            ];

            for (let i = 0; i < board.length; i++) {
                board[i].setValue(debugBoard[i]);
            }
        }

        const getBoard = () => board; // returns the entire board

        // return the entire board with letters mapped to the squares
        const getLetters = () => {
            const letters = board.map(i => {
                let letter = i.getValue();
                if (!!letter) {
                    return letter;
                } else {
                    return `${board.indexOf(i)}`;
                }
            });
            return letters;
        };

        const printToConsole = function(a = getLetters()) {
            if (a.length === 9) {
                console.log(`${a[0]}|${a[1]}|${a[2]}`);
                console.log("-----");
                console.log(`${a[3]}|${a[4]}|${a[5]}`);
                console.log("-----");
                console.log(`${a[6]}|${a[7]}|${a[8]}`);
            } else console.log("printToConsole() error: bad input");
        }

        const updateBoard = (index, letter) => {
            // only update when the square is blank
            // returns true if successful
            if (!board[index].getValue()) {
                board[index].setValue(letter);
                return true;
            } else return false;
        };

        const resetBoard = () => {
            for (let i of board) {
                i.reset();
            }
        };

        return {getBoard, updateBoard, resetBoard, getLetters, printToConsole, loadDebugBoard};
    })();

    function Player(name = "Default Player", letter = "X") {
        let wins = 0;
        let losses = 0;

        const getName = () => name;
        const getLetter = () => letter;
        const getRecord = () => ({wins, losses});
        const setName = (newName) => {
            name = newName;
            console.log(`New Name Set: ${name}`);
            return name;
        }
        const setLetter = (newLetter) => {
            letter = newLetter;
            console.log(`New letter set for ${name}: ${letter}`);
            return letter;
        }
        const win = () => {return ++wins;};
        const lose = () => {return ++losses;};

        return {setName, getName, setLetter, getLetter, getRecord, win, lose};
    }

    function Square(idx) {
        const index = idx;
        const domElement = document.querySelector(`.idx${index}`);
        if (domElement) {
            domElement.addEventListener("click", e => {
                console.log("Clicked " + index);
                doClick(currentPlayer, index);
                updateBoardDisplay();
            });
        }
        let value = null;
        const reset = () => {
            value = null;
        }
        const getValue = () => value;
        const setValue = (newValue) => {
            value = newValue;
        }
        return {setValue, getValue, reset};
    }

    // adds player names and assigns letters
    const init = function() {
        p1 = Player("Player 1", "X");
        console.log(`Hello, ${p1.getName()}. You are letter ${p1.getLetter()}.`);
        p2 = Player("Player 2", "O");
        console.log(`Hello, ${p2.getName()}. You are letter ${p2.getLetter()}.`);
        newGame();
    };

    function newGame() {
        winner = false;
        draw = false;
        GameBoard.resetBoard();
        updateBoardDisplay();
        currentPlayer = getRandomPlayer();
        updatePlayerDisplay();
    }

    function updatePlayerDisplay() {
        const p1Div = document.querySelector(".player1");
        const p2Div = document.querySelector(".player2");
        let currentDiv, otherDiv, otherPlayer;

        // set up variables to correctly point at the proper player
        if (currentPlayer == p1) {
            currentDiv = p1Div;
            otherDiv = p2Div;
            otherPlayer = p2;
        } else {
            currentDiv = p2Div;
            otherDiv = p1Div;
            otherPlayer = p1;
        }

        // add the currentplayer class to the current player and remove it from the other player
        currentDiv.classList.add("currentplayer");
        otherDiv.classList.remove("currentplayer");

        // add >> in front of the current player name and remove it from the other player
        const currentName = currentDiv.querySelector(".nametext");
        const otherName = otherDiv.querySelector(".nametext");
        currentName.textContent = ">> " + currentPlayer.getName();
        otherName.textContent = otherPlayer.getName();

        if (winner) {
            console.log("winner detected");
            currentName.textContent = "👑 " + currentPlayer.getName();
        }
    }

    function getRandomPlayer() {
        // chooses and returns a player at random
        let player;
        if (Math.random() < 0.5) {
            player = p1;
        } else {
            player = p2;
        }
        console.log(`getRandomPlayer(): ${player.getName()} was randomly chosen.`);
        return player;
    }

    function doClick(player, squareIndex) {
        let selectionValid = false;

        if (!winner && !draw && GameBoard.updateBoard(squareIndex, player.getLetter())) {
            if (checkForWin()){
                winner = currentPlayer;
                updatePlayerDisplay();
            }
            draw = noMoreMoves(); // returns true when the board is filled
            if (!winner && !draw) {
                nextPlayer();
                updatePlayerDisplay();
            }
        }
    }

    function nextPlayer() {
        if (currentPlayer == p1) {
            currentPlayer = p2;
        } else {
            currentPlayer = p1;
        }
    }

    function newConsoleGame() {
        let currentPlayer;
        let winner = false;
        let draw = false;
        
        GameBoard.resetBoard();
        
        // randomly pick a player to go first
        currentPlayer = getRandomPlayer();

        // game loop
        while (!winner && !draw) {
            playerTurn();
            if (checkForWin()){
                winner = currentPlayer;
            }
            draw = noMoreMoves(); // returns true when the board is filled
            if (!winner && !draw) {
                nextPlayer();
            }
        }

        // if code execution gets this far, a winner has been found
        // or there is a draw
        gameOver();

        // end game results

        function playerTurn() {
            // do player move
            console.table(GameBoard.printToConsole());
            let selectionValid = false;
            do {
                let playerChoice = prompt(`${currentPlayer.getName()}'s Turn:\nPlease Enter the number of an open square:`);
                
                // use a RegEx to make sure the input is in the form of "row , col"
                const re = new RegExp("^[0-8]$");
                if (re.test(playerChoice)) {
                    // updateBoard() returns true when the move is valid
                    if (GameBoard.updateBoard(playerChoice, currentPlayer.getLetter())) {
                        selectionValid = true;
                    } else {
                        console.log("Invalid input. Please try again.");
                    }
                }
            } while (!selectionValid);
        }

        function gameOver() {
            if (winner) {
                alert(`${winner.getName()} WINS!`);
            } else if (draw) {
                alert("It's a DRAW!")
            }
            let response = prompt("Play Again?");
            if (response.toUpperCase() === "Y") {
                newConsoleGame();
            }
        }
    }
                

    function checkForWin() {
        // returns true when a win condition is detected
        // board: 
        // 0 1 2
        // 3 4 5
        // 6 7 8
        const winPatterns = [
            // horizontal wins
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // verticaL wins
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // diagonal wins
            [0, 4, 8],
            [2, 4, 6],
        ];
        const board = GameBoard.getLetters();
        // get the board values associated with each pattern and win if they are equal.
        for (let pattern of winPatterns) {
            const v1 = board[pattern[0]];
            const v2 = board[pattern[1]];
            const v3 = board[pattern[2]];
            if (v1 === v2 && v1 === v3) {
                // win detected!
                return true;
            }
        }
        // all patterns failed check
        return false;
    }

    // checks each square for a null value. When found, it returns false
    // returns true when the board is full
    function noMoreMoves() {
        const board = GameBoard.getBoard();
        for (let square of board) {
            if (!square.getValue()) {
                return false;
            }
        }
        return true;
    }

    
    // display the gameboard contents to the DOM
    function updateBoardDisplay() {
        let cells = document.querySelectorAll(".cell");
        const letters = GameBoard.getLetters();
        for (let i = 0; i < 9; i++) {
            if (letters[i] == "X" || letters[i] == "O") {
                cells[i].textContent = letters[i];
            } else cells[i].textContent = "";
            console.log(`Cell ${i}: ${letters[i]} >> ${cells[i].textContent}`);
        }
    }

    document.addEventListener("DOMContentLoaded", e => {
        init();
    });


    return {init, newGame: newConsoleGame, displayBoard: updateBoardDisplay, GameBoard};
})();