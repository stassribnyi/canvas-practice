import { Position, Directions } from '../../../shared.js';

export default class SnakeSegment {
  /**
   * the segment of the snake
   * @param {Position} position the head position of the snake
   * @param {number} size the size of one snake's segment (both width and height)
   * @param {Directions} direction the direction of the segment
   */
  constructor(position, size, direction = null) {
    this.direction = direction;
    this.position = position;
    this.size = size;
  }

  move(opposite = false) {
    if (!this.direction) {
      return;
    }

    const step = !opposite ? this.size : -this.size;

    switch (this.direction) {
      case Directions.BOTTOM: {
        this.position = new Position(this.position.x, this.position.y + step);

        break;
      }
      case Directions.TOP: {
        this.position = new Position(this.position.x, this.position.y - step);

        break;
      }
      case Directions.LEFT: {
        this.position = new Position(this.position.x - step, this.position.y);

        break;
      }
      case Directions.RIGHT: {
        this.position = new Position(this.position.x + step, this.position.y);

        break;
      }
    }
  }

  clone() {
    return new SnakeSegment(
      Position.clone(this.position),
      this.size,
      this.direction
    );
  }
}
