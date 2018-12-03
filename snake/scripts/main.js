import {
  Position,
  FPSCounter,
  getSwipeDirection,
  getKeyDirection
} from '../../shared/index.js';
import { SnakeGame } from './game/index.js';

document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchmove', handleTouchMove, { passive: false });

let initialTouch = null;

function handleTouchStart(event) {
  const { clientX, clientY } = event.touches[0];

  initialTouch = {
    clientX,
    clientY
  };
}

function handleTouchMove(event) {
  const direction = getSwipeDirection(initialTouch, event.touches[0]);

  if (!direction) {
    return;
  }

  game.handleMove(direction);

  initialTouch = null;

  event.preventDefault();
  event.stopImmediatePropagation();
}

let loaded = false;

window.addEventListener('resize', () => expand());
window.addEventListener('keydown', ({ keyCode }) => handleKey(keyCode));
window.addEventListener('load', () => {
  loaded = true;
  init();
});

let game = null;
let canvas = null;
let context = null;
let fpsCounter = null;
let toggleFPSCounter = false;

let isResizeConfirmOpened = false;

function handleKey(keyCode) {
  if (keyCode === 70) {
    toggleFPSCounter = !toggleFPSCounter;
  }

  game.handleMove(getKeyDirection(keyCode));
}

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

  fpsCounter = new FPSCounter(context);
  game = new SnakeGame(canvas, new Position(0, 0), 20);
}

function animate() {
  requestAnimationFrame(animate);

  if (!context || !game) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = context.fillStyle = '#ffeac9';

  game.update();

  if (toggleFPSCounter) {
    fpsCounter.update();
  }
}

animate();
