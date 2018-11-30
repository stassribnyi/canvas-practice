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
  draw() {
    const { x, y } = this.position;

    this.context.strokeRect(x, y, this.width, this.height);
  }
}

context.fillStyle = context.strokeStyle = 'white';
context.font = '30px Arial';

const gameLabel = new TextLabel(
  canvas,
  new Position(10, 10),
  'Snake Game',
  180,
  30
);

gameLabel.draw();

const onClick = () => {
  console.log('Snake Game Label clicked.');

  gameLabel.removeEventListener('click', onClick);

  console.log('Listener removed.');

  gameLabel.destroy();

  console.log('Snake Game Label destroyed.');
};

gameLabel.addEventListener('click', onClick);

const scaleFactor = 0.9;

const map = {
  width: canvas.width * scaleFactor,
  height: canvas.height * scaleFactor
};

const position = new Position(
  (canvas.width - map.width) / 2,
  (canvas.height - map.height) / 2
);

const game = new SnakeGame(canvas, position, map.width, map.height);
game.draw();
