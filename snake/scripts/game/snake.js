import { Position, UIElement, TextLabel } from '../../shared.js';
import GameField from './field.js';

export default class SnakeGame extends UIElement {
  constructor(container, position, tileSize) {
    const { width, height } = container;

    super(container, position, width, height);

    this.tileSize = tileSize;

    this.padding = 20;

    this.buildGame();
  }

  buildGame() {
    const totalPadding = this.padding * 2;
    const availableWidth = this.width - totalPadding;
    const availableHeight = this.height - totalPadding;

    const contentPosition = Position.sum(this.position, this.padding);
    const { width: fieldTakenWidth } = GameField.measureSize(
      availableWidth,
      availableHeight,
      this.tileSize
    );

    this.score = this.createScore(
      this.container,
      contentPosition,
      fieldTakenWidth
    );

    const scoreTakenHeight = this.score.height * 2;

    const fieldPosition = new Position(
      contentPosition.x,
      contentPosition.y + scoreTakenHeight
    );
    this.field = this.createField(
      this.container,
      fieldPosition,
      availableWidth,
      availableHeight - scoreTakenHeight,
      this.tileSize
    );
  }

  createScore(container, position, width) {
    const score = new TextLabel(container, position, 'Score: 0');

    const headerPosition = new Position(
      position.x + width - score.width,
      position.y
    );

    score.position = headerPosition;

    return score;
  }

  createField(container, position, width, height, tileSize) {
    return new GameField(container, position, width, height, tileSize);
  }

  draw() {}

  update() {
    this.draw();

    this.field.update();
    this.score.update();
  }

  destroy() {
    super.destroy();

    this.field.destroy();
    this.score.destroy();
  }
}
