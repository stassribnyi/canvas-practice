import { Container, FPSCounter, Vector } from '../shared.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();

window.addEventListener('resize', () => initialize());

class Line {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

class TicTacToeGame {
  constructor(context, position, fieldSize, cellSize) {
    this.context = context;
    this.position = position;
    this.fieldSize = fieldSize;
    this.cellSize = cellSize;

    this.reset();
  }

  reset() {
    this.verticalLines = [];
    this.horizontalLines = [];

    const fieldLength = this.cellSize * this.fieldSize;

    for (let i = 1; i < this.fieldSize; i++) {
      const shift = i * this.cellSize;

      const xStart = this.position.x + shift;
      const yStart = this.position.y + shift;

      const vlStart = new Vector(xStart, this.position.y);
      const vlEnd = new Vector(xStart, this.position.y + fieldLength);

      const hlStart = new Vector(this.position.x, yStart);
      const hlEnd = new Vector(this.position.x + fieldLength, yStart);

      this.verticalLines.push(new Line(vlStart, vlEnd));
      this.horizontalLines.push(new Line(hlStart, hlEnd));
    }
  }

  drawLine(from, to) {
    this.context.lineWidth = this.cellSize / 20;
    this.context.strokeStyle = '#ffeac9';
    
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }

  draw() {
    for (let i = 0; i < this.fieldSize - 1; i++) {
      const vl = this.verticalLines[i];
      const hl = this.horizontalLines[i];

      this.drawLine(vl.start, vl.end);
      this.drawLine(hl.start, hl.end);
    }
  }

  update() {
    this.draw();
  }
}

let fpsCounter = null;
let game = null;

function initialize() {
  container.width = canvas.width = window.innerWidth;
  container.height = canvas.height = window.innerHeight;

  const fieldSize = 3;
  const cellSize = container.height / fieldSize / 1.5;

  const fieldLength = cellSize * fieldSize;
  const start = Vector.subtract(container.center, fieldLength / 2);

  game = new TicTacToeGame(context, start, fieldSize, cellSize);
  fpsCounter = new FPSCounter(context);
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
