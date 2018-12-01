import { UIElement } from '../../shared.js';
import { Position, getRandomInt } from '../../../shared/index.js';

export default class GameField extends UIElement {
  constructor(container, position, width, height, tileSize) {
    const mapSize = GameField.measureSize(width, height, tileSize);

    super(container, position, mapSize.width, mapSize.height);

    this.tileSize = tileSize;
  }

  draw() {
    const { x, y } = this.position;

    this.context.strokeRect(x, y, this.width, this.height);
  }

  update(fields) {
    if (!!fields) {
      fields.forEach(f => f.update());
    }

    this.draw();
  }

  destroy() {
    super.destroy();
  }

  static getRandomCellPosition(field, except = []) {
    const xAmount = Math.floor(field.width / field.tileSize);
    const yAmount = Math.floor(field.height / field.tileSize);

    const excludePoints = !except
      ? except.map(p => ({ x: p.x / field.tileSize, y: p.y / field.tileSize }))
      : [];

    const availableCells = [];

    for (let x = 0; x < xAmount; x++) {
      for (let y = 0; y < yAmount; y++) {
        if (excludePoints.some(p => p.x === x && p.y === y)) {
          continue;
        }

        availableCells.push({ x, y });
      }
    }

    if (!availableCells.length) {
      return null;
    }

    const cellIndex = getRandomInt(0, availableCells.length);
    const cell = availableCells[cellIndex];

    const xPosition = cell.x * field.tileSize;
    const yPosition = cell.y * field.tileSize;

    return new Position(
      field.position.x + xPosition,
      field.position.y + yPosition
    );
  }

  static getCentralCellPosition(field) {
    const x = Math.floor(field.width / field.tileSize / 2);
    const y = Math.floor(field.height / field.tileSize / 2);

    const xPosition = x * field.tileSize;
    const yPosition = y * field.tileSize;

    return new Position(
      field.position.x + xPosition,
      field.position.y + yPosition
    );
  }

  static measureSize(width, height, tileSize) {
    const xAmount = Math.floor(width / tileSize);
    const yAmount = Math.floor(height / tileSize);

    return {
      width: xAmount * tileSize,
      height: yAmount * tileSize
    };
  }

  static isWithinBoundaries(parent, child) {
    const { width: pw, height: ph } = parent;
    const { x: px, y: py } = parent.position;

    const { width: cw, height: ch } = child;
    const { x: cx, y: cy } = child.position;

    const withinXBoundaries = px <= cx && px + pw <= cx + cw;
    const withinYBoundaries = py <= cy && py + ph <= cy + ch;

    return withinXBoundaries && withinYBoundaries;
  }
}
