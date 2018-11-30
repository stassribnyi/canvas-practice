import { SnakeGame } from './game/index.js';
import { Position } from '../../shared/index.js';

window.addEventListener('resize', () => expand());

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function expand() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

expand();

context.font = '20px Arial';
context.strokeStyle = context.fillStyle = 'white';
const game = new SnakeGame(canvas, new Position(0, 0), 20);

game.update();
