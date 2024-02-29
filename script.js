const ToeGame = (function() {
    
    const GameBoard = (function(cellContent) {
        // create a 2D array for the gameboard. For each square,
        // add a cell object. 
        const rows = 3;
        const cols = 3;
        const board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < cols; j++) {
                board[i].push(cellContent);
            }
        }

        const getBoard = () => board; // returns the entire board

        const updateBoard = (row, col, letter) => {
            // only update when the square is blank
            // returns true if successful
            if (!board[row][col].getValue) {
                board[row][col].value = letter;
                return true;
            } else return false;
        };

        const resetBoard = () => {
            for (let i of board) {
                for (let j of i) {
                    j.reset();
                }
            }
        }

        return {getBoard, updateBoard, resetBoard};
    })(Square());

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

    return {GameBoard, Player};



})();