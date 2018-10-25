import {
  Vector,
  resolveBorderCollision,
  getRandomArbitrary
} from '../utilities.js';
import { Circle } from './figures/index.js';

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

class Range {
  constructor(min = 0, max = 1) {
    this.min = min;
    this.max = max;
  }

  static divide(a, b) {
    if (typeof b === 'number') {
      return new Range(a.min / b, a.max / b);
    }

    return new Range(a.min / b.min, a.max / b.max);
  }
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();

window.addEventListener('resize', () => initialize());

// settings
const amountOfCircles = 400;
const radiusRange = new Range(10, 30);
const speedRange = new Range(10, 60);

let figures = [];

function initialize() {
  container.width = canvas.width = window.innerWidth;
  container.height = canvas.height = window.innerHeight;
  figures = [];

  for (let index = 0; index < amountOfCircles; index++) {
    const radius = getRandomArbitrary(radiusRange.min, radiusRange.max);

    const x = getRandomArbitrary(radius, container.width - radius);
    const y = getRandomArbitrary(radius, container.height - radius);

    const newSpeedRange = Range.divide(speedRange, radius);
    const speedFromTo = [-newSpeedRange.min, newSpeedRange.max];

    const dx = getRandomArbitrary(...speedFromTo);
    const dy = getRandomArbitrary(...speedFromTo);

    const position = new Vector(x, y);
    const velocity = new Vector(dx, dy);

    figures.push(new Circle(context, position, velocity, radius));
  }
}

function animate() {
  requestAnimationFrame(animate);

  context.clearRect(0, 0, container.width, container.height);

  figures.forEach(figure => {
    figure.update();
    resolveBorderCollision(figure, container.width, container.height);
  });
}

initialize();
animate();
