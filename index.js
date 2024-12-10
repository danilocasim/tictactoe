"use strict";

const gameBoard = (() => {
  const cells = 9;
  const board = [];

  for (let i = 0; i < cells; i++) {
    board.push(Cell());
  }

  const getBoard = () => board;

  const setMarker = (index, player) => {
    board[index].addMarker(player.marker);
  };

  return { getBoard, setMarker };
})();

function Cell() {
  let value;

  const addMarker = (player) => {
    value = player;
  };

  const removeAllValues = () => {
    value = undefined;
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

    const drawPattern = currentBoard
      .map((cell) => cell.getValue())
      .every((el) => typeof el === "string");

    const winningPattern = () => {
      let isWin;
      const combination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      const sameX = (el) => {
        if (el === "X") return true;
      };

      const sameO = (el) => {
        if (el === "O") return true;
      };

      combination.forEach((row) => {
        if (
          [
            currentBoard[row[0]].getValue(),
            currentBoard[row[1]].getValue(),
            currentBoard[row[2]].getValue(),
          ].every(sameX) ||
          [
            currentBoard[row[0]].getValue(),
            currentBoard[row[1]].getValue(),
            currentBoard[row[2]].getValue(),
          ].every(sameO)
        ) {
          isWin = true;
          console.log("Win!");
        }
      });

      return isWin;
    };

    return { winningPattern, drawPattern };
  };

  const render = () => {
    const board = gameBoard.getBoard();
    const buttons = document.querySelectorAll(".board button");

    buttons.forEach((button, index) => {
      let marker = board[index].getValue();

      if (marker !== undefined) {
        button.textContent = `${marker}`;
      } else {
        button.textContent = "";
      }
    });
  };

  const printPlayersTurn = () => {
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const playRound = () => {
    const currentBoard = board.getBoard();
    const buttons = document.querySelectorAll(".board button");

    buttons.forEach((button, index) => {
      button.addEventListener("click", (e) => {
        if (!currentBoard[index].getValue()) {
          board.setMarker(index, getActivePlayer());
          render();
          switchPlayerTurn();
          printPlayersTurn();
        }
        if (checkWinner().winningPattern()) {
          switchPlayerTurn();
          console.log(`${getActivePlayer().name} is the winner`);
          buttons.forEach((button) => (button.disabled = true));
        } else if (checkWinner().drawPattern) {
          console.log("DRAW!");
          buttons.forEach((button) => (button.disabled = true));
        }
      });
    });
    const reset = document.querySelector("#reset");
    reset.addEventListener("click", () => {
      currentBoard.forEach((cell) => cell.removeAllValues());
      render();
      activePlayer = players[0];
      buttons.forEach((button) => (button.disabled = false));
    });
    printPlayersTurn();
  };

  return { getActivePlayer, playRound };
})();

const game = gameController;

game.playRound();
