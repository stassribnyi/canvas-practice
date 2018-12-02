import { Colors, Position, UIElement, Directions } from '../../shared.js';

import FieldCell from './field-cell.js';
import GameField from './field.js';
import GameScore from './score.js';
import Snake from './snake.js';
import Food from './food.js';

export default class SnakeGame extends UIElement {
  constructor(container, position, tileSize) {
    const { width, height } = container;

    super(container, position, width, height);

    const { score, field, snake, food } = SnakeGame.buildGame(
      container,
      position,
      width,
      height,
      tileSize,
      20
    );

    this.score = score;
    this.field = field;
    this.snake = snake;
    this.food = food;
  }

  checkRules() {
    const catched = this.snake.canBeEaten(this.food);

    if (catched) {
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

  handleKey(keyCode) {
    switch (keyCode) {
      case 38:
      case 87:
        this.snake.setHeadDirection(Directions.TOP);
        break;
      case 39:
      case 68:
        this.snake.setHeadDirection(Directions.RIGHT);
        break;
      case 37:
      case 65:
        this.snake.setHeadDirection(Directions.LEFT);
        break;
      case 40:
      case 83:
        this.snake.setHeadDirection(Directions.BOTTOM);
        break;
      case 13:
        // TODO Remove
        this.snake.eat(2);
      default:
        break;
    }

    return;
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

  static buildGame(container, position, width, height, tileSize, padding) {
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

    // Increase snake's speed to 10 segments by second
    const snake = new Snake(headPosition, tileSize, 10);

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
