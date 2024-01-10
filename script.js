// Game logic
const Gameboard = (function() {
  let gameboard = new Array(9);
  const getBoard = () => gameboard;
  const add = (index, mark) => gameboard[index] = mark;
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
    getBoard,
    add,
    reset,
    availableCells,
  }
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
  }
}

function gameController () {
  let activePlayer;

  const players = EventsHandler.getPlayersNames();
  const player1 = createPlayer(players.player1Name, "x");
  const player2 = createPlayer(players.player2Name, "o");

  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;

  const switchPlayer = (player1, player2) => activePlayer = activePlayer === player1 ? player2 : player1;
  const getActivePlayer = ()=> activePlayer;
  const launchGame = () => {
    Gameboard.reset();
    DisplayController.displayPlayersNames();
    DisplayController.displayScores(player1, player2);
    switchPlayer(player1, player2);
    DisplayController.displayTurn(activePlayer);
    EventsHandler.handleBoard();
    
  }

  const gameOver = () => {
    const board = Gameboard.getBoard();
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
        DisplayController.displayResult(activePlayer.name);
        return true;
      }
    }

    if (Gameboard.availableCells().length === 0) {
      DisplayController.displayResult();
      return true;
    }

    return false;
  }

  return {
    getPlayer1,
    getPlayer2,
    switchPlayer,
    getActivePlayer,
    launchGame,
    gameOver,
  };
};


const DisplayController = (function() {
  const modal = document.querySelector('dialog');

  const displayMark = (mark, index) => {
    const cell = document.querySelector(`#cell-${index}`);
    cell.innerText = mark;
  };

  const displayTurn = (player) => {
    const speaker = document.querySelector('#speaker');
    speaker.innerText = `${player.name} turn!`;
  };

  const displayPlayersNames = () => {
    const playerNames = EventsHandler.getPlayersNames();

    player1Spot = document.querySelector('#player-1 h2');
    player1Spot.innerText = playerNames.player1Name;
    player2Spot = document.querySelector('#player-2 h2');
    player2Spot.innerText = playerNames.player2Name;
  }

  const displayScores = (player1, player2) => {
    const player1Score = document.querySelector('#player-1 p');
    const player2Score = document.querySelector('#player-2 p');

    player1Score.innerText = `Score: ${player1.getScore()}`;
    player2Score.innerText = `Score: ${player2.getScore()}`;
  }

  const displayResult = (player) => {
    const speaker = document.querySelector('#speaker');
    if (player) {
      speaker.innerText = `${player} wins!`;
    } else speaker.innerText = "It's a draw!";
  }

  return {
    displayMark,
    displayTurn,
    displayPlayersNames,
    displayScores,
    displayResult,
  };

})();

const EventsHandler = (function() {

  const getPlayersNames = () => {
    const player1Input = document.querySelector('#player-1-name').value;
    const player2Input = document.querySelector('#player-2-name').value;
    const player1Name = player1Input === "" ? "Player 1" : player1Input;
    const player2Name = player2Input === "" ? "Player 2" : player2Input;

    return {player1Name, player2Name};
  };

  const handleBoard = () => {
    cells = document.querySelectorAll('.cell');
    cells.forEach( cell => {
      cell.addEventListener('click', handleCellClick)
    });
  };

  function handleCellClick(e) {
    const cellId = e.target.id;
    const cellIndex = parseInt(cellId.slice(-1));
  
    let activePlayer = game.getActivePlayer();

    if (Gameboard.availableCells().includes(cellIndex)) {
      Gameboard.add(cellIndex, activePlayer.mark);
      DisplayController.displayMark(activePlayer.mark, cellIndex);

      if (game.gameOver()) {
        DisplayController.displayScores(game.getPlayer1(), game.getPlayer2());
        cells.forEach(cell => {
          cell.removeEventListener('click', handleCellClick);
        });
      } else {
        game.switchPlayer(game.getPlayer1(), game.getPlayer2());
        activePlayer = game.getActivePlayer();
        DisplayController.displayTurn(activePlayer);
      }
    }
  }

  return {
    getPlayersNames,
    handleBoard,
  }
})();

const modal = document.querySelector('dialog');
const closeBtn = document.querySelector('dialog button');
const submitBtn = document.querySelector('.submit');

addEventListener('load', () => modal.showModal());

closeBtn.addEventListener('click', modal.close());

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  modal.close()
  game = gameController();
  game.launchGame();
})
