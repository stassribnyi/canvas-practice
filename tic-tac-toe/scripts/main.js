import { Container, FPSCounter, Vector } from '../shared.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();

window.addEventListener('resize', () => initialize());

let fpsCounter = null;

function initialize() {
  container.width = canvas.width = window.innerWidth;
  container.height = canvas.height = window.innerHeight;

  fpsCounter = new FPSCounter(context);
}

function drawLine(from, to) {
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(to.x, to.y);
  context.stroke();
}

function animate() {
  requestAnimationFrame(animate);

  context.clearRect(0, 0, container.width, container.height);
  context.font = '12px PressStart2P';

  const fieldSize = 3;
  const cellSize = container.height / fieldSize / 1.5;

  const fieldLength = cellSize * fieldSize;
  const start = Vector.subtract(container.center, fieldLength / 2);

  
  context.strokeStyle = '#ffeac9';
  context.lineWidth = container.height / 75;

  for (let index = 1; index < fieldSize; index++) {
    const shift = index * cellSize;

    const xStart = start.x + shift;
    const yStart = start.y + shift;

    const startVerticalLine = new Vector(xStart, start.y);
    const endVerticalLine = new Vector(xStart, start.y + fieldLength);

    const startHorizontalLine = new Vector(start.x, yStart);
    const endHorizontalLine = new Vector(start.x + fieldLength, yStart);

    drawLine(startVerticalLine, endVerticalLine);
    drawLine(startHorizontalLine, endHorizontalLine);
  }

  fpsCounter.update();
}

initialize();
animate();
