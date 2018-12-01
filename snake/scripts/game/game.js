import { Position, Directions, UIElement, TextLabel } from '../../shared.js';

import GameField from './field.js';
import Snake from './snake.js';
import FieldCell from './field-cell.js';

export default class SnakeGame extends UIElement {
  constructor(container, position, tileSize) {
    const { width, height } = container;

    super(container, position, width, height);

    const { score, field, snake } = SnakeGame.buildGame(
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
  }

  draw() {}

  update() {
    this.draw();

    this.snake.move();
    const snakeFields = this.snake.segments.map(
      ({ position }) =>
        new FieldCell(this.container, position, this.snake.segmentSize, 'green')
    );

    this.field.update(snakeFields);
    this.score.update();
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

    const {
      x: headX,
      y: headY,
      tileSize: snakeSize
    } = GameField.getCentralCell(availableWidth, availableHeight, tileSize);

    const headPosition = new Position(headX * snakeSize, headY * snakeSize);
    const snake = new Snake(headPosition, snakeSize);

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
      field,
      snake
    };
  }

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
      default:
        break;
    }

    return;
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
