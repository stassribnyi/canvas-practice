import { Position, Directions } from '../../shared.js';

const DEFAULT_SNAKES_SPEED = 1;

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

  move() {
    switch (this.direction) {
      case Directions.BOTTOM: {
        this.position = new Position(
          this.position.x,
          this.position.y + this.size
        );

        break;
      }
      case Directions.TOP: {
        this.position = new Position(
          this.position.x,
          this.position.y - this.size
        );

        break;
      }
      case Directions.LEFT: {
        this.position = new Position(
          this.position.x - this.size,
          this.position.y
        );

        break;
      }
      case Directions.RIGHT: {
        this.position = new Position(
          this.position.x + this.size,
          this.position.y
        );

        break;
      }
    }
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

  eat() {
    const old = { ...this.segments[0] };
    const news = new Position(old.x - this.segmentSize, old.y);
    this.segments.unshift(news);
  }

  moveSegments() {
    const head = this.segments[0];

    this.segments.forEach(s => s.move());
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

  setHeadDirection(direction) {
    const head = this.segments[0];

    head.direction = direction;
  }
}
