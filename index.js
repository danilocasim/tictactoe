"use strict";

const gameBoard = (() => {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const setMarker = (row, column, player) => {
        board[row][column].addMarker(player.marker);
    };

    const printBoard = () => {
        const boardWithValues = board.map((row) =>
            row.map((cell) => cell.getValue())
        );
        console.log(boardWithValues);
    };
    return { board, getBoard, setMarker, printBoard };
})();

function Cell() {
    let value;

    const addMarker = (player) => {
        value = player;
    };

    const removeAllValues = () => {
        value = "";
    };

    const getValue = () => value;

    return {
        addMarker,
        getValue,
        removeAllValues,
    };
}

const gameController = ((
    playerOneName = "Player 1",
    playerTwoName = "Player 2"
) => {
    const board = gameBoard;

    const players = [
        { name: playerOneName, marker: "X", score: 0 },
        { name: playerTwoName, marker: "O", score: 0 },
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const checkWinner = () => {
        const currentBoard = board.getBoard();

        const clearValues = () => {
            for (let i = 0; i < 3; i++) {
                board.board[i] = [];
                for (let j = 0; j < 3; j++) {
                    board.board[i].push(Cell());
                }
            }
        };

        const sameX = (el) => {
            if (el === "X") return true;
        };

        const sameO = (el) => {
            if (el === "O") return true;
        };

        const drawPattern =
            currentBoard[0]
            .map((cell) => cell.getValue())
            .every((el) => typeof el === "string") &&
            currentBoard[1]
            .map((cell) => cell.getValue())
            .every((el) => typeof el === "string") &&
            currentBoard[2]
            .map((cell) => cell.getValue())
            .every((el) => typeof el === "string");

        const winningPattern =
            currentBoard[0].map((cell) => cell.getValue()).every(sameX) ||
            currentBoard[1].map((cell) => cell.getValue()).every(sameX) ||
            currentBoard[2].map((cell) => cell.getValue()).every(sameX) || [
                currentBoard[0][0].getValue(),
                currentBoard[1][0].getValue(),
                currentBoard[2][0].getValue(),
            ].every(sameX) || [
                currentBoard[0][1].getValue(),
                currentBoard[1][1].getValue(),
                currentBoard[2][1].getValue(),
            ].every(sameX) || [
                currentBoard[0][2].getValue(),
                currentBoard[1][2].getValue(),
                currentBoard[2][2].getValue(),
            ].every(sameX) || [
                currentBoard[0][0].getValue(),
                currentBoard[1][1].getValue(),
                currentBoard[2][2].getValue(),
            ].every(sameX) || [
                currentBoard[0][2].getValue(),
                currentBoard[1][1].getValue(),
                currentBoard[2][0].getValue(),
            ].every(sameX) ||
            currentBoard[0].map((cell) => cell.getValue()).every(sameO) ||
            currentBoard[1].map((cell) => cell.getValue()).every(sameO) ||
            currentBoard[2].map((cell) => cell.getValue()).every(sameO) || [
                currentBoard[0][0].getValue(),
                currentBoard[1][0].getValue(),
                currentBoard[2][0].getValue(),
            ].every(sameO) || [
                currentBoard[0][1].getValue(),
                currentBoard[1][1].getValue(),
                currentBoard[2][1].getValue(),
            ].every(sameO) || [
                currentBoard[0][2].getValue(),
                currentBoard[1][2].getValue(),
                currentBoard[2][2].getValue(),
            ].every(sameO) || [
                currentBoard[0][0].getValue(),
                currentBoard[1][1].getValue(),
                currentBoard[2][2].getValue(),
            ].every(sameO) || [
                currentBoard[0][2].getValue(),
                currentBoard[1][1].getValue(),
                currentBoard[2][0].getValue(),
            ].every(sameO);

        if (winningPattern) {
            console.log(`${getActivePlayer().name} is the winner`);
            getActivePlayer().score++;
            console.log(
                `(Player1) Score: ${players[0].score} (Player2) Score: ${players[1].score}`
            );

            if (players[0].score === 3) {
                console.log(`${player[0].name} Won`);
                players[0].score = 0;
                players[1].score = 0;
            } else if (players[1].score === 3) {
                console.log(`${players[1].name} Won`);
                players[0].score = 0;
                players[1].score = 0;
            }
            console.log("Clearing all cells");
            clearValues();
            console.log("Starting....");
            activePlayer = players[1];
        } else if (drawPattern) {
            console.log("DRAW!");
            console.log("Clearing all cells");
            clearValues();
            activePlayer = players[1];
        }
    };

    const printCurrentBoard = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const playRound = (row, column) => {
        const currentBoard = board.getBoard();

        if (!currentBoard[row][column].getValue()) {
            board.setMarker(row, column, getActivePlayer());
            checkWinner();
            switchPlayerTurn();
            printCurrentBoard();
        }
    };

    printCurrentBoard();

    return { getActivePlayer, playRound };
})();

const game = gameController;