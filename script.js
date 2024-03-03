const ToeGame = (function() {
    // Player variables
    let p1, p2;
    
    const GameBoard = (function() {
        // create an array for the gameboard. For each square,
        // add a square object. The board will be indexed as follows:
        // 0 1 2
        // 3 4 5
        // 6 7 8
        const board = [];
        for (let i = 0; i < 9; i++) {
            board.push(Square());
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

    function Square() {
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
    const init = (function() {
        p1 = Player(prompt("Player 1, what is your name?"), "X");
        console.log(`Hello, ${p1.getName()}. You are letter ${p1.getLetter()}.`);
        p2 = Player(prompt("Player 2 [O], what is your name?"), "O");
        console.log(`Hello, ${p2.getName()}. You are letter ${p2.getLetter()}.`);
    })();

    function newGame() {
        let currentPlayer;
        let winner = false;
        
        GameBoard.resetBoard();
        
        // randomly pick a player to go first
        if (Math.random() < 0.5) {
            currentPlayer = p1;
        } else {
            currentPlayer = p2;
        }
        console.log(`${currentPlayer.getName()} will go first!`);

        while (!winner) {
            // do player move
            playerTurn();

            // check for win condition
            // set winner true if needed
            if (checkForWin()){
                winner = currentPlayer;
            }
            // next player please
            nextPlayer();
        }

        // if code execution gets this far, a winner has been found
        gameOver();

        // end game results

        function nextPlayer() {
            if (currentPlayer == p1) {
                currentPlayer = p2;
            } else {
                currentPlayer = p1;
            }
        }

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
            alert(`${winner.getName()} WINS!`);
            let response = prompt("Play Again?");
            if (response.toUpperCase() === "Y") {
                newGame();
            }
        }
    }

    function checkForWin() {
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



    return {newGame, GameBoard};
})();