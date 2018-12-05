import { TextAlignOptions, Colors } from '../../../constants/index.js';
import { UIElement } from '../common/index.js';

const DEFAULT_BASELINE = 'top';

export default class TextLabel extends UIElement {
  constructor(
    container,
    position,
    labelText,
    textAlign = null,
    foregroundColor = null
  ) {
    super(container, position, null, null);

    this.foregroundColor = foregroundColor || Colors.FOREGROUND;
    this.textAlign = textAlign || TextAlignOptions.START;
    this.labelText = labelText;
    this.adjustSize();
  }

  draw() {
    const { x, y } = this.position;

    const oldBaseline = this.context.textBaseline;
    const oldTextAlign = this.context.textAlign;
    const oldFillStyle = this.context.fillStyle;

    this.context.fillStyle = this.foregroundColor;
    this.context.textBaseline = DEFAULT_BASELINE;
    this.context.textAlign = this.textAlign;

    this.context.fillText(this.labelText, x, y);

    this.context.textBaseline = oldBaseline;
    this.context.textAlign = oldTextAlign;
    this.context.fillStyle = oldFillStyle;
  }

  adjustSize() {
    const { width, height } = UIElement.measureText(
      this.context,
      this.labelText
    );

    this.width = width;
    this.height = height;
  }

  update(labelText) {
    if (!!labelText) {
      this.labelText = labelText;
    }

    this.adjustSize();

    this.draw();
  }
}
