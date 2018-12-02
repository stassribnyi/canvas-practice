import { UIElement, Colors } from '../../shared.js';

export default class FieldCell extends UIElement {
  constructor(container, position, tileSize, color) {
    super(container, position, tileSize, tileSize);

    this.color = color;
  }

  draw() {
    const { x, y } = this.position;

    const oldFillStyle = this.context.fillStyle;
    const oldStrokeStyle = this.context.strokeStyle;

    this.context.fillStyle = this.color;
    this.context.strokeStyle = Colors.DARK;

    this.context.fillRect(x, y, this.width, this.height);
    this.context.strokeRect(x, y, this.width, this.height);

    this.context.fillStyle = oldFillStyle;
    this.context.strokeStyle = oldStrokeStyle;
  }

  update(color) {
    if (!!color) {
      this.color = color;
    }

    this.draw();
  }
}
