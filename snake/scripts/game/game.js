import { Colors, Position, UIElement, Button } from '../../shared.js';

import {
  GameMenu,
  MenuItem,
  FieldCell,
  GameField,
  GameScore,
  GameOverMenu,
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

    const menuItems = [
      new MenuItem(`Snake's Menu`, MenuItemTypes.TEXT),
      new MenuItem('New Game', MenuItemTypes.BUTTON, () => this.reset()),
      new MenuItem('Resume', MenuItemTypes.BUTTON, () => this.toggleMenu())
    ];

    const buildArgs = {
      container,
      position,
      width,
      height,
      menuItems,
      tileSize,
      padding
    };

    const { menuButton, score, field, menu } = SnakeGame.createGameUI(
      buildArgs
    );
    const { snake, food } = SnakeGame.createGameItems(field);

    this.state = GameStates.READY;

    this.menuButton = menuButton;
    this.score = score;
    this.field = field;
    this.menu = menu;

    this.snake = snake;
    this.food = food;

    this.menuButton.addEventListener('click', () => this.toggleMenu());
  }

  checkRules() {
    const isGameOver = this.snake.segments.some(segment => {
      const segmentWillBeEaten = this.snake.canBeEaten(segment);
      const boundariesWasViolated = !GameField.isWithinBoundaries(this.field, {
        position: segment.position,
        width: segment.size,
        height: segment.size
      });

      return segmentWillBeEaten || boundariesWasViolated;
    });

    if (isGameOver) {
      this.state = GameStates.LOSS;

      return;
    }

    const caught = this.snake.canBeEaten(this.food);

    if (!caught) {
      return;
    }

    this.snake.eat();

    const segmentsPositions = this.snake.segments.map(x => x.position);
    const newFoodPosition = GameField.getRandomCellPosition(
      this.field,
      segmentsPositions
    );

    if (!newFoodPosition) {
      this.state = GameStates.WIN;

      return;
    }

    this.food = this.food.clone(newFoodPosition);

    this.score.increment();
  }

  draw() {}

  foodToCell(container, food) {
    return new FieldCell(container, food.position, food.size, Colors.RED);
  }

  handleMove(directions) {
    if (this.state !== GameStates.READY && this.state !== GameStates.PLAYING) {
      return;
    }

    this.snake.setHeadDirection(directions);
  }

  reset() {
    this.state = GameStates.READY;
    this.score.resetScore();

    this.gameOver.destroy();
    this.gameOver = null;

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

  toggleMenu() {
    if (this.state === GameStates.WIN || this.state === GameStates.LOSS) {
      return;
    }

    this.state =
      this.state === GameStates.PAUSED ? GameStates.PLAYING : GameStates.PAUSED;
  }

  update() {
    if (this.state === GameStates.PLAYING || this.state === GameStates.READY) {
      this.snake.move();
      this.checkRules();
    }

    const snakeCells = this.snakeToCells(this.container, this.snake);

    const foodCell = this.foodToCell(this.container, this.food);

    const cells = [...snakeCells, foodCell];

    this.draw();
    this.field.update(cells);
    this.score.update();
    this.menuButton.update();

    if (this.state === GameStates.PAUSED) {
      this.menu.update();
    }

    if (this.state === GameStates.WIN || this.state === GameStates.LOSS) {
      this.updateGameOver(this.state === GameStates.WIN);
    }
  }

  updateGameOver(victoryAchieved) {
    if (!!this.gameOver) {
      this.gameOver.update();

      return;
    }

    const bestScoreKey = 'snake-best-score';
    const currentScore = this.score.getCurrentScore();
    const bestScore = sessionStorage.getItem(bestScoreKey) || 0;

    if (currentScore > bestScore) {
      sessionStorage.setItem(bestScoreKey, currentScore);
    }

    this.gameOver = new GameOverMenu(
      this.field.container,
      this.field.position,
      this.field.width,
      this.field.height,
      victoryAchieved,
      currentScore,
      bestScore,
      () => this.reset()
    );
  }

  destroy() {
    super.destroy();

    this.menuButton.destroy();
    this.field.destroy();
    this.score.destroy();
    this.menu.destroy();
  }

  static createGameUI({
    container,
    position,
    width,
    height,
    menuItems,
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
      menuItems
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
