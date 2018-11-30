import { UIElement } from '../common/index.js';

export default class TextLabel extends UIElement {
  constructor(container, position, labelText, width, height) {
    super(container, position, width, height);

    this.labelText = labelText;
  }

  draw() {
    const { x, y } = this.position;

    this.context.textBaseline = 'top';
    this.context.fillText(this.labelText, x, y, this.width);
  }

  update(labelText) {
    if (!!labelText) {
      this.labelText = labelText;
    }

    this.draw();
  }
}
