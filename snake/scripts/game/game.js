import { Colors, Position, UIElement, Directions } from '../../shared.js';

import FieldCell from './field-cell.js';
import GameField from './field.js';
import GameScore from './score.js';
import Snake from './snake.js';
import Food from './food.js';

const GameStates = Object.freeze({
  PLAYING: Symbol('playing'),
  PAUSED: Symbol('paused'),
  READY: Symbol('ready'),
  LOSS: Symbol('loss'),
  WIN: Symbol('win')
});

const DEFAULT_GAME_SPEED = 5;

export default class SnakeGame extends UIElement {
  constructor(container, position, tileSize, padding = 20) {
    const { width, height } = container;

    super(container, position, width, height);

    const buildArgs = { container, position, width, height, tileSize, padding };

    const { score, field, snake, food } = SnakeGame.buildGame(buildArgs);

    this.score = score;
    this.field = field;
    this.snake = snake;
    this.food = food;
  }

  checkRules() {
    const caughtSelf = this.snake.segments.some(segment =>
      this.snake.canBeEaten(segment)
    );

    const outOfField = this.snake.segments.some(
      segment =>
        !GameField.isWithinBoundaries(this.field, {
          position: segment.position,
          width: segment.size,
          height: segment.size
        })
    );

    if (outOfField || caughtSelf) {
      // TODO implement game state
      alert('Game over!');
      const bestScore = +sessionStorage.getItem('best-snake-score');

      if (this.score.score > bestScore) {
        sessionStorage.setItem('best-snake-score', this.score.score);

        alert(`Best Score: ${this.score.score}`);
      }

      location.reload();

      return;
    }

    const caught = this.snake.canBeEaten(this.food);

    if (caught) {
      this.snake.eat();

      const segmentsPositions = this.snake.segments.map(x => x.position);
      const newFoodPosition = GameField.getRandomCellPosition(
        this.field,
        segmentsPositions
      );

      this.food = this.food.clone(newFoodPosition);

      this.score.increment();
    }
  }

  draw() {}

  handleMove(directions) {
    this.snake.setHeadDirection(directions);
  }

  update() {
    this.snake.move();
    this.checkRules();

    const snakeCells = this.snakeToCells(this.container, this.snake);

    const foodCell = this.foodToCell(this.container, this.food);

    const cells = [...snakeCells, foodCell];

    this.draw();
    this.field.update(cells);
    this.score.update();
  }

  foodToCell(container, food) {
    return new FieldCell(container, food.position, food.size, Colors.RED);
  }

  snakeToCells(container, snake) {
    return snake.segments.map(
      ({ position, size }) =>
        new FieldCell(container, position, size, Colors.GREEN)
    );
  }

  destroy() {
    super.destroy();

    this.field.destroy();
    this.score.destroy();
  }

  static buildGame({ container, position, width, height, tileSize, padding }) {
    const totalPadding = padding * 2;
    const availableWidth = width - totalPadding;
    const availableHeight = height - totalPadding;
    const contentPosition = Position.sum(position, padding);

    const { width: fieldTakenWidth } = GameField.measureSize(
      availableWidth,
      availableHeight,
      tileSize
    );

    const score = SnakeGame.createScore(
      container,
      contentPosition,
      fieldTakenWidth
    );

    const scoreTakenHeight = score.height * 2;

    const fieldPosition = new Position(
      contentPosition.x,
      contentPosition.y + scoreTakenHeight
    );

    const field = SnakeGame.createField(
      container,
      fieldPosition,
      availableWidth,
      availableHeight - scoreTakenHeight,
      tileSize
    );

    const headPosition = GameField.getCentralCellPosition(field);
    const foodPosition = GameField.getRandomCellPosition(field, [headPosition]);

    const food = new Food(foodPosition, tileSize);

    const snake = new Snake(headPosition, tileSize, DEFAULT_GAME_SPEED);

    return {
      score,
      field,
      snake,
      food
    };
  }

  static createScore(container, position, width) {
    return new GameScore(
      container,
      new Position(position.x + width, position.y)
    );
  }

  static createField(container, position, width, height, tileSize) {
    return new GameField(container, position, width, height, tileSize);
  }
}
