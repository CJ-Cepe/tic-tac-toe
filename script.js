//factory function
function Player(playerNo, name, sign) {
    function getPlayerNo() {
        return playerNo;
    }

    function getName() {
        return name;
    }

    function getSign() {
        return sign;
    }

    return { getPlayerNo, getName, getSign };
}

//factory function
function Scoreboard() {
    let round = 0,
        p1 = 0,
        p2 = 0,
        tie = 0;

    //setters, trying different forms of function
    const addRound = () => {
        round++;
    };
    const addP1 = () => p1++;
    const addP2 = function () {
        p2++;
    };
    function addTie() {
        tie++;
    }

    //getters
    const getRound = () => round;
    const getP1 = () => p1;
    const getP2 = () => p2;
    const getTie = () => tie;

    return { addRound, addP1, addP2, addTie, getRound, getP1, getP2, getTie };
}

function Gameboard() {
    const board = ['', '', '', '', '', '', '', '', ''];

    const setBoard = (sign, index) => {
        board[index] = sign;
        console.log(board);
    };
    const render = () => {
        let tiles = document.querySelectorAll('.tile');
        tiles.forEach((tile) => {
            if (!tile.classList.contains('taken')) {
                tile.textContent = board[tile.dataset.index];
            }
        });
    };

    return { render, setBoard };
}

//IIFE
const Game_Controller = (() => {
    console.log('watermelon');
    //Start-EL
    let p1 = Player('1', 'Sigma', 'X'),
        p2 = Player('2', 'Winston', 'O');
    var currentPlayer = null;
    //enable board

    if (p1.getSign == 'X') {
        currentPlayer = p1;
    } else {
        currentPlayer = p2;
    }

    let gameBoard = Gameboard();
    console.log(p1.getSign(), p2.getSign());
    let tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile) => {
        tile.addEventListener('click', (e) => {
            gameBoard.setBoard(currentPlayer.getSign(), tile.dataset.index);
            gameBoard.render();
            tile.classList.add('taken');
        });
    });
})();
