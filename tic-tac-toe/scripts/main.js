import { Container, FPSCounter } from '../shared.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();

let fpsCounter = null;

function initialize() {
  container.width = canvas.width = window.innerWidth;
  container.height = canvas.height = window.innerHeight;

  fpsCounter = new FPSCounter(context);
}

function animate() {
  requestAnimationFrame(animate);

  context.clearRect(0, 0, container.width, container.height);
  context.font = '12px PressStart2P';

  fpsCounter.update();
}

initialize();
animate();
