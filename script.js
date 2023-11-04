/*
    1. button to start the game
    2. store the gameboard as an array inside of a Gameboard object
    3. Set up your HTML
        write a JavaScript function that will render the contents of the gameboard array to the webpage






*/

const Gameboard = (() => {
    const gameboard = ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'];

    const render = () => {
        let consoleGameBoard = '';
        for (let i = 0; i < 9; i++) {
            consoleGameBoard += gameboard[i];
            if (i == 2 || i == 5) {
                consoleGameBoard += '\n';
            }
        }
        console.log(consoleGameBoard);
    };

    return render;
})();

Gameboard();
