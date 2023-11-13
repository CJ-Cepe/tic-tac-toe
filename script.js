//factory function - 2 instances
function Player(playerNo, name, sign) {
    const getPlayerNo = () => playerNo;
    const getName = () => name;
    const getSign = () => sign;

    return { getPlayerNo, getName, getSign };
}

//factory function - 1 instances each game
function Scoreboard() {
    let round = 1,
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
            let backTile = tile.querySelector('.tile-back');
            if (task === 'render') {
                if (!tile.classList.contains('taken')) {
                    backTile.textContent = board[tile.dataset.index];
                }
            } else if (task === 'reset') {
                if (!tile.classList.remove('taken')) {
                    backTile.textContent = board[tile.dataset.index];
                    backTile.classList.remove('win');
                    tile.querySelector('.tile-content').style.transform =
                        'rotateY(0deg)';
                    tile.classList.remove('O', 'X');
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
            let tiles = Array.from(document.querySelectorAll('.tile'));

            setTimeout(function () {
                tiles[a].querySelector('.tile-back').classList.add('win');
            }, 300);

            setTimeout(function () {
                tiles[b].querySelector('.tile-back').classList.add('win');
            }, 600);

            setTimeout(function () {
                tiles[c].querySelector('.tile-back').classList.add('win');
            }, 900);

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
        displayController.setPlayerTurn(
            currentPlayer.getName(),
            currentPlayer.getSign()
        ); //update display - whose turn is it
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
            tile.classList.add(`${currentPlayer.getSign()}`);
            tile.querySelector('.tile-content').style.transform =
                'rotateY(180deg)';
            tile.querySelector('.tile-content').style.transition =
                'transform 0.5s';

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
                displayController.setPlayerTurn(
                    currentPlayer.getName(),
                    currentPlayer.getSign()
                ); //display current player
            }
        });
    });

    const reset = document.querySelector('.reset');
    reset.addEventListener('click', () => {
        gameBoard.resetBoard();
        currentPlayer.setCurrentPlayer();
        displayController.setPlayerTurn(
            currentPlayer.getName(),
            currentPlayer.getSign()
        );
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
    const p1MenuName = document.querySelector('#p1-name');
    const p2MenuName = document.querySelector('#p2-name');
    let p1Sign = 'X';
    let p2Sign = 'O';

    //game elements
    const p1GameName = gameBoard.querySelector('.p1');
    const p2GameName = gameBoard.querySelector('.p2');
    const round = gameBoard.querySelector('.round');
    const p1Score = document.createElement('span');
    const p2Score = document.createElement('span');
    const tieScore = gameBoard.querySelector('.tie-score');
    const playerTurn = gameBoard.querySelector('.turn');
    const game = gameBoard.querySelector('.game');

    start.addEventListener('click', () => {
        menu.classList.toggle('disable');
        gameBoard.classList.toggle('disable');

        if (p1MenuName.value.length == 0) {
            p1MenuName.value = 'Player 1';
        }
        if (p2MenuName.value.length == 0) {
            p2MenuName.value = 'Player 2';
        }

        p1GameName.textContent = `${p1MenuName.value}: `;
        p2GameName.textContent = `${p2MenuName.value}: `;
        p1GameName.appendChild(p1Score);
        p2GameName.appendChild(p2Score);
        p1Score.classList.add('p1-score', 'score');
        p2Score.classList.add('p2-score', 'score');
        p1Score.textContent = '0';
        p2Score.textContent = '0';
        tieScore.textContent = '0';
        round.textContent = '1';
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
                console.log(`P1: ${p1Sign} P2: ${p2Sign}`);
            } else if (menuSigns[0].classList.contains('o-sign')) {
                menuSigns[0].textContent = 'O';
                menuSigns[1].textContent = 'X';
                p1Sign = 'O';
                p2Sign = 'X';
                console.log(`P1: ${p1Sign} P2: ${p2Sign}`);
            }
        });
    }

    const reset = () => {
        menu.classList.toggle('disable');
        gameBoard.classList.toggle('disable');
    };

    const getP1Name = () => {
        return p1MenuName.value;
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

    const setPlayerTurn = (player, sign) => {
        playerTurn.textContent = `${player}'s  Turn`;
        if (sign == 'X') {
            console.log(player, sign);
            playerTurn.style.color = 'var(--pink1)';
        } else {
            console.log(player, sign);
            playerTurn.style.color = 'var(--green1)';
        }
    };

    const displayWinner = (player, name) => {
        if (player === 'tie') {
            playerTurn.textContent = "It's a TIE !";
            playerTurn.style.color = 'var(--white1)';
        } else {
            playerTurn.textContent = `${name} WINS !`;
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

/*================== To Do =================*/

/*  
    - tiles on hover
    - icons
    - add ai
*/
