import { Container, FPSCounter, Vector, DEFAULT_FONT, setCanvasScaling } from '../shared.js';

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
  setCanvasScaling(container, canvas);

  const fieldSize = 3;

  const availableSpace =
    container.height > container.width ? container.width : container.height;

  const cellSize = availableSpace / fieldSize / 1.5;

  const fieldLength = cellSize * fieldSize;
  const start = Vector.subtract(container.center, fieldLength / 2);

  game = new TicTacToeGame(context, start, fieldSize, cellSize);
  fpsCounter = new FPSCounter(canvas);
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
  context.font = DEFAULT_FONT;

  game.update();
  fpsCounter.update();
}

initialize();
animate();
