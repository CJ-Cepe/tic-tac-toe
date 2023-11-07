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

    const getBoard = () => {
        return [...board];
    };

    const setBoard = (sign, index) => {
        board[index] = sign;
        console.log(board);
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
        let tiles = document.querySelectorAll('.tile');
        tiles.forEach((tile) => {
            if (!tile.classList.remove('taken')) {
                tile.textContent = board[tile.dataset.index];
            }
        });
    };

    const render = () => {
        let tiles = document.querySelectorAll('.tile');
        tiles.forEach((tile) => {
            if (!tile.classList.contains('taken')) {
                tile.textContent = board[tile.dataset.index];
            }
        });
    };

    return { render, setBoard, getBoard, resetBoard };
}

//regular function
function checkWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
        let [a, b, c] = winningCombinations[i];
        console.log(board[a], board[b], board[c]);
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            console.log('same');
            return board[a];
        }
    }

    if (!board.includes('')) {
        return 'tie';
    }

    return null;
}

//regular function
function PlayerRotation(p1, p2) {
    let currentPlayer, nextPlayer;

    const setCurrentPlayer = () => {
        if (p1.getSign() === 'X') {
            currentPlayer = p1;
            nextPlayer = p2;
        } else {
            currentPlayer = p2;
            nextPlayer = p1;
        }
    };

    const getCurrentPlayer = () => {
        return currentPlayer;
    };

    const getNextPlayer = () => {
        return nextPlayer;
    };

    const nextTurn = () => {
        [currentPlayer, nextPlayer] = [nextPlayer, currentPlayer];
    };

    return { setCurrentPlayer, getCurrentPlayer, getNextPlayer, nextTurn };
}

//IIFE
const GameController = (() => {
    //Start-EL
    let p1 = Player('1', 'Sigma', 'X'),
        p2 = Player('2', 'Winston', 'O');
    let gameBoard = Gameboard();
    let scoreBoard = Scoreboard();
    var playerRotation = PlayerRotation(p1, p2);
    playerRotation.setCurrentPlayer();

    let tiles = document.querySelectorAll('.tile');

    tiles.forEach((tile) => {
        tile.addEventListener('click', (e) => {
            gameBoard.setBoard(
                playerRotation.getCurrentPlayer().getSign(),
                tile.dataset.index
            );
            gameBoard.render();
            tile.classList.add('taken');
            let signWinner = checkWin(gameBoard.getBoard());

            //display winner - console
            if (signWinner == 'tie') {
                console.log('its a Tie');
                scoreBoard.addTie();
                gameBoard.resetBoard();
            } else if (signWinner) {
                console.log(
                    `${playerRotation
                        .getCurrentPlayer()
                        .getName()} P${playerRotation
                        .getCurrentPlayer()
                        .getPlayerNo()} Wins!!!`
                );

                //update scoring
                if (playerRotation.getCurrentPlayer().getPlayerNo() === 1) {
                    scoreBoard.addP1();
                } else {
                    scoreBoard.addP2();
                }

                //reset
                gameBoard.resetBoard();
                playerRotation.setCurrentPlayer();
            } else {
                playerRotation.nextTurn();
            }
        });
    });
})();

/*================== Steps =================*/

/*
    1. update scoring
    2. handle tie
    3. handle switching of players
    4. reposition render()
    5. do set up form





*/
