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

})();