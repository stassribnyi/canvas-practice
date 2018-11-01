import { Container, FPSCounter, Vector } from '../shared.js';

import { TicTacToeGame } from './game/game.js';

const isTouchScreen = 'ontouchstart' in document.documentElement;

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();

window.addEventListener('resize', () => initialize());
window.addEventListener('click', ({ x, y }) => clicked(x, y));
window.addEventListener('mousemove', ({ x, y }) => moved(x, y));

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

function clicked(x, y) {
  game.handleClick(new Vector(x, y));
}

function moved(x, y) {
  if (isTouchScreen) {
    return;
  }

  const position = new Vector(x, y);
  const { style } = canvas;

  style.cursor = game.canBeClicked(position) ? 'pointer' : 'default';

  game.hoverCell(position);
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
