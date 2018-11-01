import { Vector } from '../../shared.js';

const image = new Image();
image.addEventListener('load', () => {}, false);
image.src = './assets/tic-tac-toe.png';

export class CellState {
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

export class Cell {
  constructor(context, position, width, height) {
    this.context = context;
    this.state = CellState.Unset;

    this.tileSize = 111;
    this.scaleFactor = 0.8;
    this.xTile = new Vector(0, 0);
    this.oTile = new Vector(113, 0);

    const shiftX = (width - width * this.scaleFactor) / 2;
    const shiftY = (height - height * this.scaleFactor) / 2;

    this.position = Vector.sum(position, new Vector(shiftX, shiftY));

    this.width = width * this.scaleFactor;
    this.height = height * this.scaleFactor;

    this.isHovered = false;
  }

  getTile() {
    switch (this.state) {
      case CellState.OSet:
        return this.oTile;
      case CellState.XSet:
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
    const { x, y } = this.position;

    if (this.isHovered) {
      this.context.fillStyle = '#424a6d78';
      this.context.fillRect(x, y, this.width, this.height);
    }

    const tile = this.getTile();
    if (!tile) {
      return;
    }

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

  hoverIn() {
    this.isHovered = true;
  }

  hoverOut() {
    this.isHovered = false;
  }

  update() {
    this.draw();
  }
}
