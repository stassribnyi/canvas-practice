import { UIElement } from '../../shared.js';

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

  static getCentralCell(width, height, tileSize) {
    const x = Math.floor(width / tileSize / 2);
    const y = Math.floor(height / tileSize / 2);

    return {
      x,
      y,
      tileSize
    };
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
