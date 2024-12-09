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
    { name: playerOneName, marker: "X" },
    { name: playerTwoName, marker: "O" },
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

    const winningPattern = () => {
      let isWin;
      const combination = [
        [0, 1, 2],
        [0, 1, 2],
        [0, 1, 2],
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2],
        [0, 1, 2],
        [2, 1, 0],
      ];

      const sameX = (el) => {
        if (el === "X") return true;
      };

      const sameO = (el) => {
        if (el === "O") return true;
      };

      combination.forEach((row) => {
        if (
          currentBoard[0].map((cell) => cell.getValue()).every(sameX) ||
          currentBoard[1].map((cell) => cell.getValue()).every(sameX) ||
          currentBoard[2].map((cell) => cell.getValue()).every(sameX) ||
          [
            currentBoard[0][row[0]].getValue(),
            currentBoard[1][row[1]].getValue(),
            currentBoard[2][row[2]].getValue(),
          ].every(sameX) ||
          [
            currentBoard[0][row[0]].getValue(),
            currentBoard[1][row[1]].getValue(),
            currentBoard[2][row[2]].getValue(),
          ].every(sameO) ||
          currentBoard[0].map((cell) => cell.getValue()).every(sameO) ||
          currentBoard[1].map((cell) => cell.getValue()).every(sameO) ||
          currentBoard[2].map((cell) => cell.getValue()).every(sameO)
        ) {
          isWin = true;
          console.log("Win!");
        }
      });

      return isWin;
    };

    if (winningPattern()) {
      console.log(`${getActivePlayer().name} is the winner`);

      console.log("Clearing all cells");
      clearValues();
      console.log("Starting....");

      // Always the player 1 will be the first
      activePlayer = players[1];
    } else if (drawPattern) {
      console.log("DRAW!");
      console.log("Clearing all cells");
      clearValues();

      // Always the player 1 will be the first
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
