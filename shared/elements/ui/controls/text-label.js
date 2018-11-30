import { UIElement } from '../common/index.js';

const DEFAULT_BASELINE = 'top';

export default class TextLabel extends UIElement {
  constructor(container, position, labelText) {
    super(container, position, null, null);

    this.labelText = labelText;
    this.adjustSize();
  }

  draw() {
    const { x, y } = this.position;

    const oldBaseline = this.context.textBaseline;

    this.context.textBaseline = DEFAULT_BASELINE;
    this.context.fillText(this.labelText, x, y, this.width);

    this.context.textBaseline = oldBaseline;
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

    this.draw();
  }
}
