import {
  Colors,
  Position,
  FPSCounter,
  getKeyDirection,
  getSwipeDirection,
  DEFAULT_FONT,
} from '../../shared/index.js';
import { SnakeGame } from './game/index.js';

let loaded = false;

window.addEventListener('touchstart', handleTouchStart, { passive: false });
window.addEventListener('touchmove', handleTouchMove, { passive: false });
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('resize', expand);
window.addEventListener('load', () => {
  loaded = true;
  init();
});

let game = null;
let canvas = null;
let context = null;
let fpsCounter = null;
let initialTouch = null;

let isResizeConfirmOpened = false;

function handleKeyDown({ keyCode }) {
  if (!loaded) {
    return;
  }

  if (keyCode === 27) {
    game.toggleMenu();

    return;
  }

  const direction = getKeyDirection(keyCode);

  if (!direction) {
    return;
  }

  game.handleMove(direction);
}

function handleTouchStart(event) {
  if (!loaded) {
    return;
  }

  const { clientX, clientY } = event.touches[0];

  initialTouch = {
    clientX,
    clientY
  };
}

function handleTouchMove(event) {
  if (!loaded) {
    return;
  }

  const direction = getSwipeDirection(initialTouch, event.touches[0]);

  if (!direction) {
    return;
  }

  game.handleMove(direction);

  initialTouch = null;

  event.preventDefault();
  event.stopImmediatePropagation();
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

// TODO: update to use scaling
function init() {
  canvas = document.querySelector('canvas');
  context = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  context.font = DEFAULT_FONT;
  context.lineWidth = 2;

  fpsCounter = new FPSCounter(canvas);
  game = new SnakeGame(canvas, new Position(0, 0), 20);
}

function animate() {
  requestAnimationFrame(animate);

  if (!context || !game) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = context.fillStyle = Colors.FOREGROUND;

  game.update();

  fpsCounter.update();
}

animate();
