import { Position, TextLabel, UIElement } from '../shared.js';

window.addEventListener('resize', () => expand());

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function expand() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

expand();

class SnakeGame extends UIElement {
  constructor(container, tileSize) {
    // Create Game Field
    const xAmount = Math.floor(container.width / tileSize);
    const yAmount = Math.floor(container.height / tileSize);
    const reserve = 5;

    const map = {
      width: (xAmount - reserve) * tileSize,
      height: (yAmount - reserve) * tileSize
    };

    const position = new Position(
      (container.width - map.width) / 2,
      (container.height - map.height) / 2
    );

    super(container, position, map.width, map.height);

    this.createTopPanel();
  }

  createTopPanel() {
    this.score = new TextLabel(this.container, null, 'Score: X', 200, 10);

    this.score.position = new Position(
      this.position.x + this.width - this.score.width,
      this.position.y
    );
  }

  draw() {
    const { x, y } = this.position;

    this.context.strokeRect(x, y, this.width, this.height);
  }

  update() {
    this.draw();

    this.score.update();
  }

  destroy() {
    super.destroy();

    this.score.destroy();
  }
}
context.font = '20px Arial';
context.strokeStyle = context.fillStyle = 'white';
const game = new SnakeGame(canvas, 20);

game.update();
