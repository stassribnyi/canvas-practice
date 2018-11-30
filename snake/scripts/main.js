import { SnakeGame } from './game/index.js';
import { Position } from '../../shared/index.js';

let loaded = false;

window.addEventListener('resize', () => expand());
window.addEventListener('load', () => {
  loaded = true;
  init();
});

let game = null;
let canvas = null;
let context = null;

let isResizeConfirmOpened = false;

function expand() {
  let reset = false;
  if (!isResizeConfirmOpened) {
    isResizeConfirmOpened = true;
    reset = confirm(
      'You have just changed size of the screen, do you wanna resize game field? If yes, current game will be lost!'
    );

    isResizeConfirmOpened = false;
  }

  if (!loaded || !reset) {
    return;
  }

  init();
}

function init() {
  canvas = document.querySelector('canvas');
  context = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.font = '12px PressStart2P';

  game = new SnakeGame(canvas, new Position(0, 0), 20);

  game.update();
}

function animate() {
  requestAnimationFrame(animate);

  if (!context || !game) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = context.fillStyle = '#ffeac9';

  game.update();
  // fpsCounter.update();
}

animate();
