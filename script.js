const ToeGame = (function() {
    // Player variables
    let p1, p2, currentPlayer;
    // Game State
    let winner = false;
    let draw = false;
    // DOM Objects
    const message = document.getElementById("messagetext");
    const btnNew = document.getElementById("newgame");
    const btnP1Edit = document.getElementById("btnP1Edit");
    const btnP2Edit = document.getElementById("btnP2Edit");
    const p1Wins = document.querySelector(".player1 > .wins");
    const p1Losses = document.querySelector(".player1 > .losses");
    const p1Ties = document.querySelector(".player1 > .ties");
    const p2Wins = document.querySelector(".player2 > .wins");
    const p2Losses = document.querySelector(".player2 > .losses");
    const p2Ties = document.querySelector(".player2 > .ties");
   
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

        return {getBoard, updateBoard, resetBoard, getLetters};
    })();

    function Player(n = "Default Player", letter = "X") {
        let record = {
            wins: 0,
            losses: 0,
            draws: 0,
        }
        let name = n;

        const getName = () => name;
        const getLetter = () => letter;
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
        const win = () => {return ++record.wins;};
        const lose = () => {return ++record.losses;};
        const draw = () => {return ++record.draws;};

        return {record, setName, getName, setLetter, getLetter, win, lose, draw};
    }

    function Square(idx) {
        const index = idx;
        const domElement = document.querySelector(`.idx${index}`);
        if (domElement) {
            domElement.addEventListener("click", e => {
                console.log("Clicked " + index);
                clickSquare(currentPlayer, index);
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
        message.textContent = `New Game! ${currentPlayer.getName()} goes first!`;
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

        // crown the winner
        if (winner) {
            console.log("winner detected");
            currentName.textContent = "👑 " + currentPlayer.getName();
        }

        updateRecords();
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

    function clickSquare(player, squareIndex) {
        if (!winner && !draw && GameBoard.updateBoard(squareIndex, player.getLetter())) {
            if (checkForWin()){
                winner = currentPlayer;
                let otherPlayer = (currentPlayer === p1) ? p2 : p1;
                currentPlayer.win();
                otherPlayer.lose();
                message.textContent = `3-in-a-row! ${currentPlayer.getName()} WINS!`;
                updatePlayerDisplay();
            } else {
                draw = noMoreMoves(); // returns true when the board is filled
                if (draw) {
                    message.textContent = "It's a DRAW!";
                    p1.draw();
                    p2.draw();
                    updatePlayerDisplay();
                }
            }
            if (!winner && !draw) {
            nextPlayer();
            message.textContent = `${currentPlayer.getName()}'s Turn`;
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
            // FOR DEBUG
            // console.log(`Cell ${i}: ${letters[i]} >> ${cells[i].textContent}`);
        }
    }

    function renamePlayer(e) {
        const player = e.currentTarget.player;
        if (player === 1) {
            p1.setName(prompt(`Enter a new name for Player 1 [${p1.getLetter()}]`));
        } else {
            p2.setName(prompt(`Enter a new name for Player 2 [${p2.getLetter()}]`));
        }
        updatePlayerDisplay();
    }

    function updateRecords() {
        p1Wins.textContent = `Wins: ${p1.record.wins}`;
        p1Losses.textContent = `Losses: ${p1.record.losses}`;
        p1Ties.textContent = `Ties: ${p1.record.draws}`;
        p2Wins.textContent = `Wins: ${p2.record.wins}`;
        p2Losses.textContent = `Losses: ${p2.record.losses}`;
        p2Ties.textContent = `Ties: ${p2.record.draws}`;
    }

    init();

    btnNew.addEventListener("click", newGame);

    btnP1Edit.addEventListener("click", renamePlayer);
    btnP1Edit.player = 1;
    btnP2Edit.addEventListener("click", renamePlayer);
    btnP2Edit.player = 2;
    
})();