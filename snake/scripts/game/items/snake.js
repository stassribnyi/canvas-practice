import { Position, Directions } from '../../../shared.js';

import SnakeSegment from './snake-segment.js';

const DEFAULT_SNAKES_SPEED = 1;
const DEFAULT_SNAKES_FOOD_AMOUNT = 1;

export default class Snake {
  /** the instance of snake
   * @param {Position} position the head position of the snake
   * @param {number} segmentSize the size of one snake's segment (both width and height)
   * @param {number} speed the speed of snake's movement in numbers of segments by one second
   * by default is one
   */
  constructor(position, segmentSize, speed = DEFAULT_SNAKES_SPEED) {
    this.segments = [new SnakeSegment(position, segmentSize)];
    this.speed = speed;

    this.prevTime = new Date().getTime();
    this.upcomingDirection = null;
    this.upcomingSegments = 0;
  }

  canBeEaten(food) {
    return this.segments.some(
      segment =>
        segment !== food &&
        segment.position.x === food.position.x &&
        segment.position.y === food.position.y
    );
  }

  eat(amount = DEFAULT_SNAKES_FOOD_AMOUNT) {
    this.upcomingSegments += amount;
  }

  moveSegments(direction) {
    const head = this.segments[0];

    head.direction = direction;

    const snakeTailIndex = this.segments.length - 1;

    if (this.upcomingSegments > 0) {
      const snakeTail = this.segments[snakeTailIndex];
      const newTail = snakeTail.clone();

      this.segments.push(newTail);

      this.upcomingSegments--;
    }

    for (let i = snakeTailIndex; i >= 0; i--) {
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
    this.moveSegments(this.upcomingDirection);
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

    this.upcomingDirection = direction;
  }
}
