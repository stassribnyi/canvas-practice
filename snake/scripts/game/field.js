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

  update() {
    this.draw();
  }

  destroy() {
    super.destroy();
  }

  static measureSize(width, height, tileSize) {
    const xAmount = Math.floor(width / tileSize);
    const yAmount = Math.floor(height / tileSize);

    return {
      width: xAmount * tileSize,
      height: yAmount * tileSize
    };
  }
}
