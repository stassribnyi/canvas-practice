import { Position, Directions, UIElement, TextLabel } from '../../shared.js';

import GameField from './field.js';
import Snake from './snake.js';
import FieldCell from './field-cell.js';

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

    this.eated = 0;
    this.score = score;
    this.field = field;
    this.snake = snake;
    this.food = food;
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
    this.draw();

    this.snake.move();
    const catched = this.snake.segments.some(
      ({ position }) => this.food.x === position.x && this.food.y === position.y
    );

    if (catched) {
      this.snake.eat();
      this.food = GameField.getRandomCellPosition(this.field, [
        this.snake.segments.map(x => x.position)
      ]);

      this.eated++;
    }

    const snakeFields = this.snake.segments.map(
      ({ position, size }) =>
        new FieldCell(this.container, position, size, 'rgb(57, 158, 90)')
    );

    const foodCell = new FieldCell(
      this.container,
      this.food,
      this.snake.segmentSize,
      'rgb(255, 107, 107)'
    );

    const cells = [...snakeFields, foodCell];

    this.field.update(cells);
    this.score.update(`Scores: ${this.eated}`);
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

    const food = GameField.getRandomCellPosition(field, [headPosition]);

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
    const score = new TextLabel(container, position, 'Score: 0');

    const headerPosition = new Position(
      position.x + width - score.width,
      position.y
    );

    score.position = headerPosition;

    return score;
  }

  static createField(container, position, width, height, tileSize) {
    return new GameField(container, position, width, height, tileSize);
  }
}
