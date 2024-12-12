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

const gameController = (
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
    const playerTurn = document.querySelector(".player-turn");
    const playerOneScore = document.querySelector(".player1 > .score");
    const playerTwoScore = document.querySelector(".player2 > .score");
    const playerOneName = document.querySelector(".player1 .name");
    const playerTwoName = document.querySelector(".player2 .name");

    buttons.forEach((button, index) => {
      let marker = board[index].getValue();

      if (marker !== undefined) {
        button.textContent = `${marker}`;
      } else {
        button.textContent = "";
      }
    });

    playerOneName.textContent = `${players[0].name}`;
    playerTwoName.textContent = `${players[1].name}`;
    playerOneScore.textContent = `${players[0].score}`;
    playerTwoScore.textContent = `${players[1].score}`;

    playerTurn.textContent = `${getActivePlayer().name}'s turn`;
  };

  const printPlayersTurn = () => {
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const switchPlayerOneTurn = () => {
    activePlayer = players[0];
  };

  return {
    getActivePlayer,
    checkWinner,
    switchPlayerTurn,
    render,
    printPlayersTurn,
    switchPlayerOneTurn,
  };
};

const screenController = () => {
  const game = gameController(
    playersName.getPlayerOneName(),
    playersName.getPlayerTwoName()
  );
  const board = gameBoard;
  const currentBoard = gameBoard.getBoard();
  const buttons = document.querySelectorAll(".board button");
  const result = document.querySelector(".round-result");

  buttons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      if (!currentBoard[index].getValue()) {
        board.setMarker(index, game.getActivePlayer());
        game.switchPlayerTurn();
        game.render();
      }
      if (game.checkWinner().winningPattern()) {
        game.switchPlayerTurn();

        // result.textContent = `${game.getActivePlayer().name} is the winner`;
        game.getActivePlayer().score++;

        game.render();

        buttons.forEach((button) => (button.disabled = true));
      } else if (game.checkWinner().drawPattern) {
        // result.textContent = `Draw!`;
        buttons.forEach((button) => (button.disabled = true));
      }
    });
  });

  const reset = document.querySelector("#reset");
  reset.addEventListener("click", () => {
    currentBoard.forEach((cell) => cell.removeAllValues());
    game.switchPlayerOneTurn();
    game.render();
    console.log(playersName.getPlayerOneName());
    // result.textContent = "";
    buttons.forEach((button) => (button.disabled = false));
  });
  game.render();
};
const playersName = (() => {
  const dialogContainer = document.querySelector(".dialog-container");
  const dialog = document.querySelector("dialog");
  const form = document.querySelector("dialog form");
  const currentBoard = gameBoard.getBoard();
  const buttons = document.querySelectorAll(".board button");

  dialogContainer.addEventListener("click", (e) => {
    const target = e.target.id;
    switch (target) {
      case "openDialog":
        dialog.showModal();
        break;
      case "closeDialog":
        dialog.close();
        break;
    }
  });

  dialog.addEventListener("close", () => {
    screenController();
  });

  let playerOneName;
  let playerTwoName;

  form.addEventListener("submit", () => {
    playerOneName = document.querySelector("#playerOneName").value;
    playerTwoName = document.querySelector("#playerTwoName").value;
    currentBoard.forEach((cell) => cell.removeAllValues());
    buttons.forEach((button) => (button.disabled = false));

    form.reset();
    screenController();
  });

  const getPlayerOneName = () => playerOneName;
  const getPlayerTwoName = () => playerTwoName;

  dialog.showModal();
  return {
    getPlayerOneName,
    getPlayerTwoName,
  };
})();
