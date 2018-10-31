import { Container, FPSCounter, Vector } from '../shared.js';

const image = new Image();
image.addEventListener('load', () => {}, false);
image.src = '../../assets/tic-tac-toe.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();

window.addEventListener('resize', () => initialize());
window.addEventListener('click', e => makeTurn(e));

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
    this.context = context;
    this.state = States.Unset;

    this.tileSize = 111;
    this.scaleFactor = 0.8;
    this.xTile = new Vector(0, 0);
    this.oTile = new Vector(113, 0);

    const shiftX = (width - width * this.scaleFactor) / 2;
    const shiftY = (height - height * this.scaleFactor) / 2;

    this.position = Vector.sum(position, new Vector(shiftX, shiftY));

    this.width = width * this.scaleFactor;
    this.height = height * this.scaleFactor;
  }

  getTile() {
    switch (this.state) {
      case States.OSet:
        return this.oTile;
      case States.XSet:
        return this.xTile;
      default:
        return null;
    }
  }

  contains(point) {
    const { x, y } = this.position;
    const { x: px, y: py } = point;

    const isWithinXArea = x <= px && px <= x + this.width;
    const isWithinYArea = y <= py && py <= y + this.height;

    return isWithinXArea && isWithinYArea;
  }

  draw() {
    const tile = this.getTile();
    if (!tile) {
      return;
    }

    const { x, y } = this.position;

    const options = [
      image,
      tile.x,
      tile.y,
      this.tileSize,
      this.tileSize,
      x,
      y,
      this.width,
      this.height
    ];

    this.context.drawImage(...options);
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
    this.context.strokeStyle = '#37ad83';

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

function makeTurn({ x, y }) {
  const clicked = game.cells.find(cell => cell.contains(new Vector(x, y)));

  if (clicked) {
    clicked.state = clicked.state !== States.XSet ? States.XSet : States.OSet;
  }
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
