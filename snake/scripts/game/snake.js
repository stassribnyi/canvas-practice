import { Position, Directions } from '../../shared.js';

const DEFAULT_SNAKES_SPEED = 1;
const DEFAULT_SNAKES_FOOD_AMOUNT = 1;

class SnakeSegment {
  /**
   * the segment of the snake
   * @param {Position} position the head position of the snake
   * @param {number} size the size of one snake's segment (both width and height)
   * @param {Directions} direction the direction of the segment
   */
  constructor(position, size, direction = Directions.TOP) {
    this.direction = direction;
    this.position = position;
    this.size = size;
  }

  move(opposite = false) {
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
    return new SnakeSegment({ ...this.position }, this.size, this.direction);
  }
}

export default class Snake {
  /** the instance of snake
   * @param {Position} position the head position of the snake
   * @param {number} segmentSize the size of one snake's segment (both width and height)
   * @param {number} speed the speed of snake's movement in numbers of segments by one second
   * by default is one
   */
  constructor(position, segmentSize, speed = DEFAULT_SNAKES_SPEED) {
    this.segments = [new SnakeSegment(position, segmentSize)];
    this.segmentSize = segmentSize;
    this.speed = speed;

    this.prevTime = new Date().getTime();
  }

  eat(amount = DEFAULT_SNAKES_FOOD_AMOUNT) {
    for (let i = 0; i < amount; i++) {
      const lastSegment = this.segments[this.segments.length - 1];
      const newSegment = lastSegment.clone();
      newSegment.move(true);

      this.segments.push(newSegment);
    }
  }

  moveSegments() {
    if (this.segments.length === 1) {
      this.segments[0].move();

      return;
    }

    for (let i = this.segments.length - 1; i >= 0; i--) {
      const current = this.segments[i];

      current.move();

      if (i === 0) {
        break;
      }

      const next = this.segments[i - 1];

      if (current.direction !== next.direction) {
        current.direction = next.direction;
      }
    }
  }

  move() {
    const milliseconds = 1000;
    const currentTime = new Date().getTime();
    const threshold = milliseconds / (this.speed | DEFAULT_SNAKES_SPEED);

    if (threshold > currentTime - this.prevTime) {
      return;
    }

    this.prevTime = currentTime;
    this.moveSegments();
  }

  canSetDirection(newDirection, oldDirection) {
    const moreThenOne = this.segments.length > 1;

    if (!moreThenOne) {
      return true;
    }

    if (!Directions.areOpposite(newDirection, oldDirection)) {
      return true;
    }

    return false;
  }

  setHeadDirection(direction) {
    const head = this.segments[0];

    if (!this.canSetDirection(direction, head.direction)) {
      return;
    }

    head.direction = direction;
  }
}
