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

  const printPlayersTurn = () => {
    return `${getActivePlayer().name}'s turn`;
  };

  const switchPlayerOneTurn = () => {
    activePlayer = players[0];
  };

  const setName = (player1 = "Player 1", player2 = "Player 2") => {
    players[0].name = player1;
    players[1].name = player2;
  };

  const resetScore = () => {
    players[0].score = 0;
    players[1].score = 0;
  };

  const getPlayers = () => players;

  return {
    getActivePlayer,
    checkWinner,
    switchPlayerTurn,
    printPlayersTurn,
    switchPlayerOneTurn,
    resetScore,
    getPlayers,
    setName,
  };
})();

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
        document.querySelector("body").className = "blur";
        break;
      case "closeDialog":
        dialog.close();
        document.querySelector("body").classList.remove("blur");
        break;
    }
  });

  dialog.addEventListener("close", () => {
    dialog.close();
    document.querySelector("body").classList.remove("blur");
  });

  let playerOneName;
  let playerTwoName;

  form.addEventListener("submit", () => {
    playerOneName = document.querySelector("#playerOneName").value;
    playerTwoName = document.querySelector("#playerTwoName").value;
    currentBoard.forEach((cell) => cell.removeAllValues());
    gameController.resetScore();
    let clickEvent = new Event("click");
    document.querySelector("#reset").dispatchEvent(clickEvent);
    buttons.forEach((button) => (button.disabled = false));
    form.reset();
  });

  const getPlayerOneName = () => playerOneName;
  const getPlayerTwoName = () => playerTwoName;

  return {
    getPlayerOneName,
    getPlayerTwoName,
  };
})();

const screenController = (() => {
  const name = playersName;
  const game = gameController;
  const board = gameBoard;
  const currentBoard = gameBoard.getBoard();
  const buttons = document.querySelectorAll(".board button");

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

    game.setName(name.getPlayerOneName(), name.getPlayerTwoName());

    playerOneName.textContent = `${game.getPlayers()[0].name}`;
    playerTwoName.textContent = `${game.getPlayers()[1].name}`;
    playerOneScore.textContent = `${game.getPlayers()[0].score}`;
    playerTwoScore.textContent = `${game.getPlayers()[1].score}`;

    playerTurn.textContent = `${game.printPlayersTurn()}`;
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      if (!currentBoard[index].getValue()) {
        board.setMarker(index, game.getActivePlayer());
        game.switchPlayerTurn();
        render();
      }
      if (game.checkWinner().winningPattern()) {
        game.switchPlayerTurn();

        game.getActivePlayer().score++;
        render();

        buttons.forEach((button) => (button.disabled = true));
      } else if (game.checkWinner().drawPattern) {
        buttons.forEach((button) => (button.disabled = true));
      }
    });
  });

  const reset = document.querySelector("#reset");
  reset.addEventListener("click", () => {
    currentBoard.forEach((cell) => cell.removeAllValues());
    game.switchPlayerOneTurn();
    render();
    buttons.forEach((button) => (button.disabled = false));
  });
  render();
})();
