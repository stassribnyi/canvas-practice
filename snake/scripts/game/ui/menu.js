import {
  Colors,
  Position,
  UIElement,
  drawRoundedRect,
  getRGBAFromRGBColor
} from '../../../shared.js';

export default class GameMenu extends UIElement {
  constructor(container, position, width, height) {
    const factor = 0.9;

    const avaialbleWidth = width * factor;
    const avaialbleHeight = height * factor;

    const horizontalPadding = (width - avaialbleWidth) / 2;
    const verticalPadding = (height - avaialbleHeight) / 2;

    const menuPosition = new Position(
      position.x + horizontalPadding,
      position.y + verticalPadding
    );

    super(container, menuPosition, avaialbleWidth, avaialbleHeight);
  }

  draw() {
    const oldFillStyle = this.context.fillStyle;
    const oldStrokeStyle = this.context.strokeStyle;

    this.context.fillStyle = getRGBAFromRGBColor(Colors.DARK, 0.5);
    this.context.strokeStyle = Colors.FOREGROUND;

    drawRoundedRect(this.context, this.position, this.width, this.height, 4);

    this.context.fill();
    this.context.stroke();

    this.context.fillStyle = oldFillStyle;
    this.context.strokeStyle = oldStrokeStyle;
  }
}
