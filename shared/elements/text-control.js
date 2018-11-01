import { isPointWithinRectangle } from '../utilities/index.js';
import { Vector } from '../entities/index.js';

export class TextControl {
  constructor(context, text, position, width, height) {
    this.context = context;

    this.text = text;

    this.position = position;
    this.height = height;
    this.width = width;
  }

  draw() {
    this.context.fillText(this.text, this.position.x, this.position.y);
  }

  contains(point) {
    const realPosition = new Vector(
      this.position.x,
      this.position.y - this.height
    );
    
    return isPointWithinRectangle(realPosition, point, this.width, this.height);
  }

  update(text) {
    if (!!text) {
      this.text = text;
    }

    this.draw();
  }
}
