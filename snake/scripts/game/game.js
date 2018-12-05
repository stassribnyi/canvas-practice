import { Colors, Position, UIElement, Button } from '../../shared.js';

import {
  FieldCell,
  GameField,
  GameScore,
  GameMenu,
  MenuItem,
  MenuItemTypes
} from './ui/index.js';

import { Snake, Food } from './items/index.js';

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

    const { score, field, menu, menuButton } = SnakeGame.createGameUI(
      buildArgs
    );
    const { snake, food } = SnakeGame.createGameItems(field);

    this.state = GameStates.READY;

    this.score = score;
    this.field = field;
    this.menu = menu;
    this.menuButton = menuButton;

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

    // TODO remove
    this.menu.update();
    this.menuButton.update();
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

    const menuButton = new Button(container, contentPosition, 'Menu');

    const scorePosition = new Position(
      contentPosition.x,
      contentPosition.y + menuButton.height / 2
    );

    const score = SnakeGame.createScore(
      container,
      scorePosition,
      fieldTakenWidth
    );

    const menuTakenHeight = menuButton.height * 1.5;

    const fieldPosition = new Position(
      contentPosition.x,
      contentPosition.y + menuTakenHeight
    );

    const field = SnakeGame.createField(
      container,
      fieldPosition,
      availableWidth,
      availableHeight - menuTakenHeight,
      tileSize
    );

    const menu = new GameMenu(
      container,
      fieldPosition,
      field.width,
      field.height,
      [
        new MenuItem('Scores', MenuItemTypes.TEXT),
        new MenuItem('Restart', MenuItemTypes.BUTTON),
        new MenuItem('New Game', MenuItemTypes.BUTTON),
        new MenuItem('Resume', MenuItemTypes.BUTTON)
      ]
    );

    return {
      menuButton,
      score,
      field,
      menu
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
