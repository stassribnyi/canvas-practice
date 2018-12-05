import { TextAlignOptions, Colors } from '../constants/index.js';
import { isPointWithinRectangle } from '../utilities/index.js';
import { Vector } from '../entities/index.js';
import { UIElement } from './ui/index.js';

const DEFAULT_BASELINE = 'top';

export class TextControl {
  constructor(context, position, text) {
    this.position = position;
    this.context = context;
    this.text = text;

    this.adjustSize();
  }

  adjustSize() {
    const { width, height } = UIElement.measureText(this.context, this.text);

    this.height = height;
    this.width = width;
  }

  draw() {
    const { x, y } = this.position;

    const oldBaseline = this.context.textBaseline;
    const oldTextAlign = this.context.textAlign;
    const oldFillStyle = this.context.fillStyle;

    this.context.fillStyle = Colors.FOREGROUND;
    this.context.textBaseline = DEFAULT_BASELINE;
    this.context.textAlign = TextAlignOptions.CENTER;

    this.context.fillText(this.text, x, y);

    this.context.textBaseline = oldBaseline;
    this.context.textAlign = oldTextAlign;
    this.context.fillStyle = oldFillStyle;
  }

  contains(point) {
    const realPosition = new Vector(
      this.position.x - this.width / 2,
      this.position.y
    );

    return isPointWithinRectangle(realPosition, point, this.width, this.height);
  }

  update(text) {
    if (!!text) {
      this.text = text;
    }

    this.adjustSize();

    this.draw();
  }
}
