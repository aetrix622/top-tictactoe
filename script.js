const ToeGame = (function() {
    const GameBoard = (function() {
        // create an array for the gameboard. For each square,
        // add a square object. The board will be indexed as follows:
        // 1 2 3
        // 4 5 6
        // 7 8 9
        const board = [];
        for (let i = 0; i < 9; i++) {
            board.push(Square());
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

        return {getBoard, updateBoard, resetBoard, getLetters, printToConsole};
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

    return {GameBoard, Player};



})();