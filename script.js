//factory function - 2 instances
function Player(playerNo, name, sign) {
    const getPlayerNo = () => playerNo;
    const getName = () => name;
    const getSign = () => sign;

    return { getPlayerNo, getName, getSign };
}

//factory function - 1 instances each game
function Scoreboard() {
    let round = 0,
        p1 = 0,
        p2 = 0,
        tie = 0;

    //setters, trying different forms of function
    const addRound = () => {
        return ++round;
    };
    const addP1 = () => {
        return { player: '1', value: ++p1 }; //return objects
    };
    const addP2 = function () {
        return { player: '2', value: ++p2 }; //return objects
    };
    function addTie() {
        return { player: 'tie', value: ++tie }; //return objects
    }

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
    };
}

function Gameboard() {
    const board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => {
        return [...board];
    };

    const setBoard = (sign, index) => {
        board[index] = sign;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
        updateTiles('reset');
    };

    const render = () => {
        updateTiles('render');
    };

    //hoisted
    function updateTiles(task) {
        let tiles = document.querySelectorAll('.tile');
        tiles.forEach((tile) => {
            if (task === 'render') {
                if (!tile.classList.contains('taken')) {
                    tile.textContent = board[tile.dataset.index];
                }
            } else if (task === 'reset') {
                if (!tile.classList.remove('taken')) {
                    tile.textContent = board[tile.dataset.index];
                }
            }
        });
    }

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
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
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

    const getName = () => {
        return currentPlayer.getName();
    };

    const getSign = () => {
        return currentPlayer.getSign();
    };

    const getPlayerNo = () => {
        return currentPlayer.getPlayerNo();
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

    return {
        setCurrentPlayer,
        getCurrentPlayer,
        getNextPlayer,
        nextTurn,
        getName,
        getSign,
        getPlayerNo,
    };
}

//IIFE - start
const GameController = (() => {
    let displayController = DisplayController(),
        p1,
        p2,
        gameBoard,
        scoreBoard,
        currentPlayer,
        game = displayController.getGameElement();

    //every time start button is clicked
    displayController.getStartElement().addEventListener('click', function () {
        //creates players, gameBoard, and scoreboard instances
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
        gameBoard = Gameboard();
        scoreBoard = Scoreboard();
        currentPlayer = PlayerRotation(p1, p2); //player rotation, pass players
        currentPlayer.setCurrentPlayer(); //set which player got X - first
        displayController.setPlayerTurn(currentPlayer.getName()); //update display - whose turn is it
        gameBoard.resetBoard();
        game.classList.remove('taken');
    });

    //give tiles event listeners
    let tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile) => {
        tile.addEventListener('click', (e) => {
            gameBoard.setBoard(currentPlayer.getSign(), tile.dataset.index); //give current index/tile the player's sign
            gameBoard.render(); //render the table
            tile.classList.add('taken'); //add taken class

            //check if theres winner
            let signWinner = checkWin(gameBoard.getBoard());
            if (signWinner == 'tie') {
                displayController.setScore(scoreBoard.addTie()); //increment tie
                displayController.displayWinner('tie', currentPlayer.getName());
                game.classList.add('taken'); //make whole game unclickable
            } else if (signWinner) {
                if (currentPlayer.getPlayerNo() === '1') {
                    displayController.setScore(scoreBoard.addP1()); //increment p1 score
                    displayController.displayWinner(
                        '1',
                        currentPlayer.getName()
                    );
                } else {
                    displayController.setScore(scoreBoard.addP2()); //increment p1 score
                    displayController.displayWinner(
                        '2',
                        currentPlayer.getName()
                    );
                }
                game.classList.add('taken');
            } else {
                currentPlayer.nextTurn(); //change current player
                displayController.setPlayerTurn(currentPlayer.getName()); //display current player
            }
        });
    });

    const reset = document.querySelector('.reset');
    reset.addEventListener('click', () => {
        gameBoard.resetBoard();
        currentPlayer.setCurrentPlayer();
        displayController.setPlayerTurn(currentPlayer.getName());
        if (game.classList.contains('taken')) {
            displayController.setRound(scoreBoard.addRound());
        }
        game.classList.remove('taken');
    });

    const restart = document.querySelector('.restart');
    restart.addEventListener('click', () => {
        displayController.reset();
    });
})();

function DisplayController() {
    //menu elements
    const start = document.querySelector('#start-button');
    const menu = document.querySelector('.menu');
    const gameBoard = document.querySelector('.gameboard');
    const P1MenuName = document.querySelector('#p1-name');
    const p2MenuName = document.querySelector('#p2-name');
    const p1Sign = 'O';
    const p2Sign = 'X';

    //game elements
    const p1GameName = gameBoard.querySelector('.p1');
    const p2GameName = gameBoard.querySelector('.p2');
    const round = gameBoard.querySelector('.round');
    const p1Score = gameBoard.querySelector('.p1-score');
    const p2Score = gameBoard.querySelector('.p2-score');
    const tieScore = gameBoard.querySelector('.tie-score');
    const playerTurn = gameBoard.querySelector('.turn');
    const game = gameBoard.querySelector('.game');

    start.addEventListener('click', () => {
        menu.classList.toggle('disable');
        gameBoard.classList.toggle('disable');
        p1GameName.textContent = `P1: ${P1MenuName.value}`;
        p2GameName.textContent = `P2: ${p2MenuName.value}`;
        p1Score.textContent = '0';
        p2Score.textContent = '0';
        tieScore.textContent = '0';
        round.textContent = '0';
    });

    const menuSigns = Array.from(document.querySelectorAll('.menu-sign'));
    for (let i = 0; i < 2; i++) {
        menuSigns[i].addEventListener('click', () => {
            menuSigns[0].classList.toggle('x-sign');
            menuSigns[0].classList.toggle('o-sign');
            menuSigns[1].classList.toggle('x-sign');
            menuSigns[1].classList.toggle('o-sign');

            if (menuSigns[0].classList.contains('x-sign')) {
                menuSigns[0].textContent = 'X';
                menuSigns[1].textContent = 'O';
                p1Sign = 'X';
                p2Sign = 'O';
            } else if (menuSigns[0].classList.contains('o-sign')) {
                menuSigns[0].textContent = 'O';
                menuSigns[1].textContent = 'X';
                p1Sign = 'O';
                p2Sign = 'X';
            }
        });
    }

    const reset = () => {
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

    const getStartElement = () => {
        return start;
    };

    const getGameElement = () => {
        return game;
    };

    //accepts object
    const setScore = (score) => {
        if (score.player === 'tie') {
            tieScore.textContent = score.value;
        } else if (score.player === '1') {
            p1Score.textContent = score.value;
        } else if (score.player === '2') {
            p2Score.textContent = score.value;
        }
    };

    const setRound = (value) => {
        round.textContent = value;
    };

    const setPlayerTurn = (player) => {
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
        setRound,
        displayWinner,
        reset,
        getStartElement,
        getGameElement,
    };
}

/*================== Steps =================*/

/*
    1. X and O in menu
    2. when 3 match
    3. add ai?
    4. ui







*/
