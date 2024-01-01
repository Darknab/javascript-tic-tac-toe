const Gameboard = (function() {
  let gameboard = new Array(9);
  const add = (index, mark) => gameboard[index] = mark;
  const getBoard = () => gameboard;
  const reset = () => gameboard = new Array(9);
  const availableCells = () => {
    let available = [];
    for (let index = 0 ; index < 9 ; index++) {
      if (gameboard[index] === undefined) {
        available.push(index);
      }
    }
    return available;
  };

  return {
    add,
    getBoard,
    reset,
    availableCells,
  };
})();

function createPlayer(name, mark) {
  let score = 0

  const win = () => score++;
  const getScore = () => score;
  return {
    name,
    mark,
    win,
    getScore,
  };
}

function playGame(player1, player2) {
  let activePlayer

  const switchPlayer = () => activePlayer = activePlayer === player1 ? player2 : player1;
  const getActivePlayer = () => activePlayer;

  const playRound = () => {
    const input = prompt(`${activePlayer.name} turn!`);
    if (Gameboard.availableCells().includes(parseInt(input))) {
      Gameboard.add(parseInt(input), activePlayer.mark);
    } else playRound();
  }

  const gameOver = () => {
    const board = Gameboard.getBoard();
    // List of winning combinations
    const rows = [
      [board[0], board[1], board[2]],
      [board[3], board[4], board[5]],
      [board[6], board[7], board[8]],
      [board[0], board[3], board[6]],
      [board[1], board[4], board[7]],
      [board[2], board[5], board[8]],
      [board[0], board[4], board[8]],
      [board[2], board[4], board[6]]
    ];

    for (const row of rows) {
      if (
        row[0] === activePlayer.mark &&
        row[1] === activePlayer.mark &&
        row[2] === activePlayer.mark
      ) {
        activePlayer.win();
        console.log(`${activePlayer.name} wins!`);
        return true;
      }
    }

    if (Gameboard.availableCells().length === 0) {
      console.log("It's a draw!");
      return true
    }

    return false
  }

  //execute the game
  Gameboard.reset();

  do {
    switchPlayer();
    playRound();
  } while (gameOver() === false);
  
  return {
    getActivePlayer,
    switchPlayer,
    playRound,
    gameOver,
  };
}

darknab = createPlayer('Darknab', 'x');
tema = createPlayer('Tema', 'o');


