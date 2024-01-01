const Gameboard = (function() {
  let gameboard = new Array(9);
  const add = (index, mark) => gameboard[index] = mark;
  const getBoard = () => gameboard;
  const reset = () => gameboard = new Array(9);

  return {
    add,
    getBoard,
    reset,
  };
})();

function createPlayer(name, mark) {
  return {name, mark};
}

function playGame(player1, player2) {
  let activePlayer;
  Gameboard.reset();
  
  do {
    activePlayer = switchPlayer(activePlayer, player1, player2);
    const input = prompt(`${activePlayer.name} turn!`);
    playerChoice(activePlayer, parseInt(input));
  } 
  while (gameOver(Gameboard.getBoard(), activePlayer) !== true);

  console.log('Game over!');
}

function playerChoice(player, value) {
  let boardState = Gameboard.getBoard()
  console.log(boardState);
  if (Gameboard.getBoard()[value] === undefined) {
    Gameboard.add(value, player.mark);
    console.log(Gameboard.getBoard());
  }
}

function gameOver(board, activePlayer) {
  const rows = [
    [board[0], board[1], board[2]],
    [board[3], board[4], board[5]],
    [board[6], board[7], board[8]],
    [board[0], board[3], board[6]],
    [board[1], board[4], board[7]],
    [board[2], board[5], board[8]],
    [board[0], board[4], board[8]],
    [board[2], board[4], board[6]]
  ]

  let result = false;

  for (const row of rows) {
    if (checkRow(row, activePlayer)) {
      console.log(`${activePlayer.name} wins!`);
      result = true;
      break;
    }
  }

  if (!(board.includes(undefined))) {
    console.log("It's a draw!");
    result = true;
  }

  return result;
}

function switchPlayer(player, player1, player2) {
  if (player === player1) {
    player = player2;
  } else {
    player = player1;
  }
  return player;
}


function checkRow(row, activePlayer) {
  if (row[0] === activePlayer.mark &&
      row[1] === activePlayer.mark &&
      row[2] === activePlayer.mark) {
    return true;
  } else return false;
}

darknab = createPlayer('Darknab', 'x');
tema = createPlayer('Tema', 'o');


