import { Container, FPSCounter, Vector } from '../shared.js';

var img = new Image();
img.addEventListener('load', () => {}, false);
img.src = '../../assets/tic-tac-toe.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();
const themeColor = '#ffeac9';

window.addEventListener('resize', () => initialize());

class Line {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

class States {
  static get Unset() {
    return 'unSet';
  }

  static get XSet() {
    return 'xSet';
  }

  static get OSet() {
    return 'oSet';
  }
}

class Cell {
  constructor(context, position, width, height) {
    this.width = width;
    this.height = height;
    this.state = States.Unset;
    this.context = context;
    this.position = position;
  }

  draw() {
    const { x, y } = this.position;

    this.context.drawImage(img, 113, 0, 112, 112, x, y, this.width, this.width);
  }

  update() {
    this.draw();
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

  buildFieldLines() {
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

  buildFieldCells() {
    this.cells = [];

    const cellSize = this.cellSize;

    for (let y = 0; y < this.fieldSize; y++) {
      for (let x = 0; x < this.fieldSize; x++) {
        const cellPosition = Vector.sum(
          this.position,
          new Vector(x * cellSize, y * cellSize)
        );

        const cell = new Cell(this.context, cellPosition, cellSize, cellSize);

        this.cells.push(cell);
      }
    }
  }

  drawLine(from, to) {
    this.context.lineWidth = this.cellSize / 20;
    this.context.strokeStyle = 'green';

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

  reset() {
    this.buildFieldLines();
    this.buildFieldCells();
  }

  update() {
    this.draw();

    this.cells.forEach(c => c.update());
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
