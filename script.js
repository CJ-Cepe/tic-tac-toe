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
    const addP1 = () => {
        return { player: '1', value: ++p1 };
    };
    const addP2 = function () {
        return { player: '2', value: ++p2 };
    };
    function addTie() {
        return { player: 'tie', value: ++tie };
    }

    const resetScoreBoard = () => {
        round = 0;
        p1 = 0;
        p2 = 0;
        tie = 0;
    };

    //getters
    const getRound = () => round;
    const getP1 = () => p1;
    const getP2 = () => p2;
    const getTie = () => tie;

    return {
        addRound,
        addP1,
        addP2,
        addTie,
        getRound,
        getP1,
        getP2,
        getTie,
        resetScoreBoard,
    };
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
    //start

    //display
    let displayController = DisplayController();
    //player
    let p1 = Player(
            '1',
            displayController.getP1Name(),
            displayController.getP1Sign()
        ),
        p2 = Player(
            '2',
            displayController.getP2Name(),
            displayController.getP2Sign()
        );
    //gameboard
    let gameBoard = Gameboard();
    //scoreboard
    let scoreBoard = Scoreboard();

    //player rotation, pass players
    let playerRotation = PlayerRotation(p1, p2);
    //set which player gets X - first
    playerRotation.setCurrentPlayer();
    displayController.setPlayerTurn(
        playerRotation.getCurrentPlayer().getName()
    );
    let game = document.querySelector('.game');
    //give tiles event listeners
    let tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile) => {
        tile.addEventListener('click', (e) => {
            //give board array corres sign
            //pass current player sign and index
            gameBoard.setBoard(
                playerRotation.getCurrentPlayer().getSign(),
                tile.dataset.index
            );

            //render the table
            gameBoard.render();
            //add taken class
            tile.classList.add('taken');
            //check if theres winner
            let signWinner = checkWin(gameBoard.getBoard());

            //display winner - console
            //display tie as winner
            if (signWinner == 'tie') {
                displayController.setScore(scoreBoard.addTie());
                displayController.displayWinner(
                    'tie',
                    playerRotation.getCurrentPlayer().getName()
                );

                game.classList.add('taken');
                //reset
                // gameBoard.resetBoard();
                //playerRotation.setCurrentPlayer();
            } else if (signWinner) {
                //update scoring
                if (playerRotation.getCurrentPlayer().getPlayerNo() === '1') {
                    displayController.setScore(scoreBoard.addP1());
                    displayController.displayWinner(
                        '1',
                        playerRotation.getCurrentPlayer().getName()
                    );
                } else {
                    displayController.setScore(scoreBoard.addP2());
                    displayController.displayWinner(
                        '2',
                        playerRotation.getCurrentPlayer().getName()
                    );
                }
                //reset
                //gameBoard.resetBoard();
                //playerRotation.setCurrentPlayer();
                game.classList.add('taken');
            } else {
                playerRotation.nextTurn();
                displayController.setPlayerTurn(
                    playerRotation.getCurrentPlayer().getName()
                );
            }
        });
    });

    const reset = document.querySelector('.reset');
    reset.addEventListener('click', () => {
        gameBoard.resetBoard();
        playerRotation.setCurrentPlayer();
        displayController.setPlayerTurn(
            playerRotation.getCurrentPlayer().getName()
        );
        game.classList.remove('taken');
    });

    const restart = document.querySelector('.restart');
    restart.addEventListener('click', () => {
        displayController.restart();
        scoreBoard.resetScoreBoard();
        displayController.setScore({ player: 'tie', value: 0 });
        displayController.setScore({ player: '1', value: 0 });
        displayController.setScore({ player: '2', value: 0 });
        gameBoard.resetBoard();

        game.classList.remove('taken');
        p1 = Player(
            '1',
            displayController.getP1Name(),
            displayController.getP1Sign()
        );
        p2 = Player(
            '2',
            displayController.getP2Name(),
            displayController.getP2Sign()
        );
        playerRotation.setCurrentPlayer();
        displayController.setPlayerTurn(
            playerRotation.getCurrentPlayer().getName()
        );
    });
})();

function DisplayController() {
    const start = document.querySelector('#start-button');
    const menu = document.querySelector('.menu');
    const gameBoard = document.querySelector('.gameboard');
    const P1MenuName = document.querySelector('#p1-name');
    const p2MenuName = document.querySelector('#p2-name');
    const p1Sign = 'O';
    const p2Sign = 'X';

    const p1GameName = gameBoard.querySelector('.p1');
    const p2GameName = gameBoard.querySelector('.p2');
    const round = gameBoard.querySelector('.round');
    const p1Score = gameBoard.querySelector('.p1-score');
    const p2Score = gameBoard.querySelector('.p2-score');
    const tieScore = gameBoard.querySelector('.tie-score');
    const playerTurn = gameBoard.querySelector('.turn');

    start.addEventListener('click', () => {
        menu.classList.toggle('disable');
        gameBoard.classList.toggle('disable');
        p1GameName.textContent = `P1: ${P1MenuName.value}`;
        p2GameName.textContent = `P2: ${p2MenuName.value}`;
    });

    const restart = () => {
        menu.classList.toggle('disable');
        gameBoard.classList.toggle('disable');
    };

    const getP1Name = () => {
        return P1MenuName.value;
    };

    const getP2Name = () => {
        return p2MenuName.value;
    };

    const getP1Sign = () => {
        return p1Sign;
    };

    const getP2Sign = () => {
        return p2Sign;
    };

    const setScore = (score) => {
        if (score.player === 'tie') {
            tieScore.textContent = score.value;
        } else if (score.player === '1') {
            p1Score.textContent = score.value;
        } else if (score.player === '2') {
            p2Score.textContent = score.value;
        }
    };

    const setPlayerTurn = (player) => {
        console.log(player);
        playerTurn.textContent = `${player}'s turn`;
    };

    const displayWinner = (player, name) => {
        if (player === 'tie') {
            playerTurn.textContent = "It's a Tie!!!!";
        } else {
            playerTurn.textContent = `P${player} ${name} Wins!!!`;
        }
    };

    return {
        getP1Name,
        getP2Name,
        getP1Sign,
        getP2Sign,
        setScore,
        setPlayerTurn,
        displayWinner,
        restart,
    };
}

/*================== Steps =================*/

/*
    1. update scoring
    2. handle tie
    3. handle switching of players
    4. reposition render()
    5. do set up form
    6. setup start button
    7. displayController
    8. playerTurn





*/
