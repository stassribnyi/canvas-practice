import { Colors, Position, UIElement } from '../../shared.js';

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

const DEFAULT_GAME_SPEED = 10;

export default class SnakeGame extends UIElement {
  constructor(container, position, tileSize, padding = 20) {
    const { width, height } = container;

    super(container, position, width, height);

    const buildArgs = { container, position, width, height, tileSize, padding };

    const { score, field } = SnakeGame.createGameUI(buildArgs);
    const { snake, food } = SnakeGame.createGameItems(field);

    this.state = GameStates.READY;
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
      this.state = GameStates.LOSS;

      // TODO move displaying best score into score item
      const bestScore = +sessionStorage.getItem('best-snake-score');

      if (this.score.score > bestScore) {
        sessionStorage.setItem('best-snake-score', this.score.score);
      }

      // TODO call from menu
      this.reset();

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

  foodToCell(container, food) {
    return new FieldCell(container, food.position, food.size, Colors.RED);
  }

  handleMove(directions) {
    this.snake.setHeadDirection(directions);
  }

  reset() {
    this.state = GameStates.READY;

    // TODO avoid direct setting of score field
    this.score.score = 0;

    const { snake, food } = SnakeGame.createGameItems(this.field);

    this.snake = snake;
    this.food = food;
  }

  snakeToCells(container, snake) {
    return snake.segments.map(
      ({ position, size }) =>
        new FieldCell(container, position, size, Colors.GREEN)
    );
  }

  update() {
    if (this.state !== GameStates.READY) {
      return;
    }

    this.snake.move();
    this.checkRules();

    const snakeCells = this.snakeToCells(this.container, this.snake);

    const foodCell = this.foodToCell(this.container, this.food);

    const cells = [...snakeCells, foodCell];

    this.draw();
    this.field.update(cells);
    this.score.update();
  }

  destroy() {
    super.destroy();

    this.field.destroy();
    this.score.destroy();
  }

  static createGameUI({
    container,
    position,
    width,
    height,
    tileSize,
    padding
  }) {
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

    return {
      score,
      field
    };
  }

  static createGameItems(field) {
    const headPosition = GameField.getCentralCellPosition(field);
    const foodPosition = GameField.getRandomCellPosition(field, [headPosition]);

    const food = new Food(foodPosition, field.tileSize);

    const snake = new Snake(headPosition, field.tileSize, DEFAULT_GAME_SPEED);

    return {
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
