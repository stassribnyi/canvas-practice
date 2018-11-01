import { Container, FPSCounter, Vector } from '../shared.js';

import { GameState, TicTacToeGame } from './game/game.js';
import { CellState } from './game/cell.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();

window.addEventListener('resize', () => initialize());
window.addEventListener('click', event => makeTurn(event.x, event.y));
window.addEventListener('mousemove', event => hoverCell(event));

let fpsCounter = null;
let game = null;

function initialize() {
  container.width = canvas.width = window.innerWidth;
  container.height = canvas.height = window.innerHeight;

  const fieldSize = 3;

  const availableSpace =
    container.height > container.width ? container.width : container.height;

  const cellSize = availableSpace / fieldSize / 1.5;

  const fieldLength = cellSize * fieldSize;
  const start = Vector.subtract(container.center, fieldLength / 2);

  game = new TicTacToeGame(context, start, fieldSize, cellSize);
  fpsCounter = new FPSCounter(context);
}

let firstPlayerTurn = true;

function makeTurn(x, y) {
  const clicked = game.cells.find(cell => cell.contains(new Vector(x, y)));

  if (clicked && clicked.state === CellState.Unset) {
    clicked.state = firstPlayerTurn ? CellState.XSet : CellState.OSet;

    const state = game.checkWinner();

    if (state === GameState.XWin || state === GameState.OWin) {
      if (confirm(state === GameState.XWin ? 'X Won' : '0 Won')) {
        game.reset();
      }
    }

    if (state === GameState.DeadHeat) {
      if (confirm('dead heat')) {
        game.reset();
      }
    }

    firstPlayerTurn = !firstPlayerTurn;
  }
}

function hoverCell({ x, y }) {
  game.hoverCell(new Vector(x, y));
}

function animate() {
  requestAnimationFrame(animate);

  context.clearRect(0, 0, container.width, container.height);
  context.font = '12px PressStart2P';

  game.update();
  fpsCounter.update();
}

initialize();
animate();
