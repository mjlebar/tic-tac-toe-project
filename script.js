const announce = document.querySelector(".announce"); //Top line of the document - basically signals what the current situation of the page is. I.E., lets the players know whose turn it is, or if they need to enter new names
const submit = document.querySelector(".submit"); //button to submit names
const newGame = document.querySelector(".new-game"); //button to start a new game
const names = document.querySelector(".names");
//HTML elements I want to be globally accessible because they are modified frequently

function checkNames() {
  if (
    document.querySelector("#player-1-name").value &&
    document.querySelector("#player-2-name").value
  ) {
    gamePlay.startGame();
  } else {
    announce.textContent = `I'm sorry, but both players must have names!`;
  }
} //If both players are named, starts the game - otherwise asks for names to be entered

submit.addEventListener("click", checkNames); //allows us to start the game

newGame.addEventListener("click", () => {
  gameBoard.clearBoard();
  gamePlay.resetGame();
}); //allows us to reset the game

const gameBoard = (() => {
  const spots = document.querySelectorAll(".spot");
  const board = Array.from(spots);

  function clearBoard() {
    for (let spot of board) {
      spot.textContent = "";
    }
  }
  return { board, clearBoard };
})(); //Models the game board, and attaches a function to clear it

const playerFactory = function (number, name) {
  const symbol = number == 0 ? "X" : "O"; //determines whether the player plays Xs or Os based on whether it is player 1 or player 2

  return { number, symbol, name };
}; //Factory function to create players - given a name and a number returns them, plus the appropriate symbol (x or o) for that player

//This is the function that contains actual game play mechanics - it returns a function to reset the game at the end and a function to start a new game. It has "private" functions to check if the game is over, switch the player between turns, and to add the marks to appropriate spots (which it adds to all the spots). There are a few helper functions as well
const gamePlay = (() => {
  let player1, player2, currentPlayer, gameEnded;
  //variables that need to be declared initially so they can be accessed throughout many different functions

  function resetGame() {
    player1 = undefined;
    player2 = undefined;
    currentPlayer = undefined;
    gameEnded = true; //resets playing variables

    announce.textContent = "Enter player names to begin!";

    names.classList.remove("hidden");
    newGame.classList.add("hidden"); //Removes the new game button, and adds the name submission form
  }

  function startGame() {
    const name1 = document.querySelector("#player-1-name");
    const name2 = document.querySelector("#player-2-name");
    gameEnded = false;
    player1 = playerFactory(0, name1.value);
    player2 = playerFactory(1, name2.value);
    currentPlayer = player1; //Initializes player values

    name1.value = "";
    name2.value = ""; //clears the name submission form

    names.classList.add("hidden"); //Hides name submission form

    announce.textContent = `${currentPlayer.name}'s turn!`;

    newGame.classList.remove("hidden"); //shows
  }

  function switchPlayer() {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
    announce.textContent = `${currentPlayer.name}'s turn!`;
  } //Switches player and changes name to match

  function checkBoard() {
    const rowWin =
      sameMarks(0, 1, 2) || sameMarks(3, 4, 5) || sameMarks(6, 7, 8);
    const columnWin =
      sameMarks(0, 3, 6) || sameMarks(1, 4, 7) || sameMarks(2, 5, 8);
    const diagWin = sameMarks(2, 4, 6) || sameMarks(0, 4, 8);

    if (rowWin || columnWin || diagWin) {
      announce.textContent = `${currentPlayer.name} is the winner!`;
      gameEnded = true;
    } else if (fullBoard()) {
      announce.textContent = `It's a tie!`;
      gameEnded = true;
    }
    return gameEnded;
  } //checks to see if there is a winning move, a tie, or a full board. If so, switches the gameEnded variable to reflect that

  function sameMarks(ind1, ind2, ind3) {
    const board = gameBoard.board;
    if (
      board[ind1].textContent == board[ind2].textContent &&
      board[ind2].textContent == board[ind3].textContent &&
      board[ind1].textContent
    )
      return true;
    else return false;
  } //helper function for checkBoard to compare if three entries have the same mark in them

  function fullBoard() {
    for (let spot of gameBoard.board) {
      if (spot.textContent === "") return false;
    }
    return true;
  } //helper function for checkBoard to check for ties

  const addMark = function (e) {
    if (gameEnded) return;
    const spot = e.target; //the spot that's been clicked on
    if (!spot.textContent) {
      spot.textContent = currentPlayer.symbol;
    } //the conditional ensures that marks can only be made in empty spots

    if (!checkBoard()) switchPlayer();
    //switches players only if the game does not continue
  }; //Adds appropriate player's mark to the appropriate spot, as long as game is not over

  for (let spot of gameBoard.board) {
    spot.addEventListener("click", addMark);
  }

  return { startGame, resetGame };
})();
