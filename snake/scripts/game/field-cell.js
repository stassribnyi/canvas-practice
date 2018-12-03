import { UIElement, Colors, drawRoundedRect } from '../../shared.js';

export default class FieldCell extends UIElement {
  constructor(container, position, tileSize, color) {
    super(container, position, tileSize, tileSize);

    this.color = color;
  }

  draw() {
    const oldFillStyle = this.context.fillStyle;
    const oldStrokeStyle = this.context.strokeStyle;

    this.context.fillStyle = this.color;
    this.context.strokeStyle = Colors.DARK;

    drawRoundedRect(this.context, this.position, this.width, this.height, 4);

    this.context.fill();
    this.context.stroke();

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
