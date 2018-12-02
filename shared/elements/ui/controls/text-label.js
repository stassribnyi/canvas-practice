import { TextAlignOptions } from '../../../constants/index.js';
import { UIElement } from '../common/index.js';

const DEFAULT_BASELINE = 'top';

export default class TextLabel extends UIElement {
  constructor(
    container,
    position,
    labelText,
    textAlign = TextAlignOptions.START
  ) {
    super(container, position, null, null);

    this.textAlign = textAlign;
    this.labelText = labelText;
    this.adjustSize();
  }

  draw() {
    const { x, y } = this.position;

    const oldBaseline = this.context.textBaseline;
    const oldTextAlign = this.context.textAlign;

    this.context.textBaseline = DEFAULT_BASELINE;
    this.context.textAlign = this.textAlign || TextAlignOptions.START;
    this.context.fillText(this.labelText, x, y);

    this.context.textBaseline = oldBaseline;
    this.context.textAlign = oldTextAlign;
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
