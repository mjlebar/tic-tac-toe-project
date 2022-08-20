const announce = document.querySelector(".announce"); //place where winner will be declared
const submit = document.querySelector(".submit");
//HTML elements I want to be globally accessible
const newgame = document.querySelector(".new-game");
const names = document.querySelectorAll(".name");

const gameBoard = (() => {
  const board = []; //tracks what has been marked where

  function clearBoard() {
    for (spot of board) {
      spot = "";
      board.length = 0;
    }
  } //empties the board by resetting the display and clearing the array
  return { board, clearBoard };
})(); //Models and clears board

const playerFactory = function (number, name) {
  const symbol = number == 0 ? "X" : "O"; //determines whether the player plays Xs or Os based on whether it is player 1 or player 2

  return { number, symbol, name };
};

const gamePlay = (() => {
  let player1, player2, currentPlayer, gameEnded;
  spots = document.querySelectorAll(".spot");

  function clearGame() {
    player1 = undefined;
    player2 = undefined;
    currentPlayer = undefined;
    gameEnded = true;
    spots.forEach((spot) => (spot.textContent = ""));
    announce.textContent = "Enter player names to begin!";
    names.forEach((name) => name.classList.remove("hidden"));
    submit.classList.remove("hidden");
    newgame.classList.add("hidden");
  }

  function startGame() {
    const name1 = document.querySelector("#player-1-name");
    const name2 = document.querySelector("#player-2-name");
    gameEnded = false;
    player1 = playerFactory(0, name1.value);
    player2 = playerFactory(1, name2.value);
    currentPlayer = player1;
    name1.value = ""; //clears the submission form
    name2.value = "";
    names.forEach((name) => name.classList.add("hidden"));
    submit.classList.add("hidden");
    announce.textContent = `${currentPlayer.name}'s turn!`;
    document.querySelector(".new-game").classList.remove("hidden");
  }

  function switchPlayer() {
    if (gameEnded) return;
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
    announce.textContent = `${currentPlayer.name}'s turn!`;
  } //Switches player and changes name to match

  function checkBoard() {
    // console.log(`${currentPlayer}`);
    const rowWin =
      sameMarks(0, 1, 2) || sameMarks(3, 4, 5) || sameMarks(6, 7, 8);
    const columnWin =
      sameMarks(0, 3, 6) || sameMarks(1, 4, 7) || sameMarks(2, 5, 8);
    const diagWin = sameMarks(2, 4, 6) || sameMarks(0, 4, 8);

    function fullBoard() {
      if (gameBoard.board.length !== 9) return false; //makes sure we are running through whole length of the board
      for (let i = 0; i < gameBoard.board.length; i++) {
        if (!gameBoard.board[i]) return false;
      } //checks to make sure board is fully filled in. this was surprisingly hard to get to work
      return true;
    }

    if (rowWin || columnWin || diagWin) {
      announce.textContent = `${currentPlayer.name} is the winner!`;
      gameEnded = true;
    } else if (fullBoard()) {
      announce.textContent = `It's a tie!`;
      gameEnded = true;
    }
  } //checks to see if there is a winning move, a tie, or a full board. Returns true if the game is ended so that the addMark function does not switch Players

  function sameMarks(ind1, ind2, ind3) {
    if (
      gameBoard.board[ind1] == gameBoard.board[ind2] &&
      gameBoard.board[ind2] == gameBoard.board[ind3] &&
      gameBoard.board[ind1]
    )
      return true;
    else return false;
  } //helper function for checkBoard to compare if three entries have the same mark in them

  const addMark = function (e) {
    if (gameEnded) return;
    const mark = e.target.textContent;

    if (!mark) {
      e.target.textContent = currentPlayer.symbol;
      gameBoard.board[e.target.dataset.index] = currentPlayer.symbol;
    } //the conditional ensures that marks can only be made in empty spots
    checkBoard();
    switchPlayer();
    //switches players only if the game does not continue
  }; //Adds appropriate player's mark to the appropriate spot

  spots.forEach((spot) => spot.addEventListener("click", addMark));
  return { startGame, clearGame };
})(); //Sets up gameplay

function checkNames() {
  if (
    document.querySelector("#player-1-name").value &&
    document.querySelector("#player-2-name").value
  ) {
    gamePlay.startGame();
  } else {
    announce.textContent = `I'm sorry, but both players must have names!`;
  }
} //Ensures that both players have names before game starts

submit.addEventListener("click", checkNames);

newgame.addEventListener("click", () => {
  gameBoard.clearBoard();
  gamePlay.clearGame();
});
