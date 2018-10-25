import { Circle } from './figures/index.js';
import { Vector } from '../utilities.js';

class Container {
  constructor(width = null, height = null) {
    this.width = width;
    this.height = height;
  }

  get center() {
    return {
      width: this.width / 2,
      height: this.height / 2
    };
  }
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();

window.addEventListener('resize', () => initialize());

let figures = [];

function initialize() {
  container.width = canvas.width = window.innerWidth;
  container.height = canvas.height = window.innerHeight;

  const center = container.center;

  figures.push(
    new Circle(context, new Vector(center.width, center.height), 20)
  );
}

function animate() {
  requestAnimationFrame(animate);

  context.clearRect(0, 0, container.width, container.height);

  figures.forEach(f => f.update());
}

initialize();
animate();
