export default class UIElement {
  constructor(container, position, width, height) {
    if (!(container instanceof HTMLCanvasElement)) {
      throw new Error('Container can only be a canvas element!');
    }

    this.container = container;
    this.context = container.getContext('2d');

    this.position = position;

    this.width = width;
    this.height = height;
  }

  draw() {
    const { x, y } = this.position;

    this.context.strokeRect(x, y, this.width, this.height);
  }

  update() {
    this.draw();
  }

  destroy() {}

  static measureText(context, text) {
    const width = context.measureText(text).width;
    const height = parseInt(context.font.match(/\d+/), 10);

    return {
      width,
      height
    };
  }
}
