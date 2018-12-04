import { Position } from '../../../entities/index.js';
import { drawRoundedRect } from '../../../utilities/index.js';
import { ClickableUIElement } from '../common/index.js';
import { Colors } from '../../../constants/index.js';

import TextLabel from './text-label.js';

const DEFAULT_BTN_PADDING = 10;

export default class Button extends ClickableUIElement {
  constructor(container, position, buttonText, padding = DEFAULT_BTN_PADDING) {
    super(container, position, null, null);

    this.padding = padding;

    const labelPosition = new Position(
      position.x + this.padding,
      position.y + this.padding
    );

    this.buttonLabel = new TextLabel(container, labelPosition, buttonText);

    this.adjustSize();
  }

  adjustSize() {
    const { width, height } = this.buttonLabel;

    const doublePadding = this.padding * 2;

    this.width = width + doublePadding;
    this.height = height + doublePadding;
  }

  draw() {
    const oldFillStyle = this.context.fillStyle;
    const oldStrokeStyle = this.context.strokeStyle;

    this.context.fillStyle = Colors.BACKGROUND;
    this.context.strokeStyle = Colors.FOREGROUND;

    drawRoundedRect(this.context, this.position, this.width, this.height, 4);

    this.context.fill();
    this.context.stroke();

    this.context.fillStyle = oldFillStyle;
    this.context.strokeStyle = oldStrokeStyle;
  }

  update() {
    this.adjustSize();

    this.draw();

    this.buttonLabel.update();
  }
}
