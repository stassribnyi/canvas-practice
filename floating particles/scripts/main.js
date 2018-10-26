import {
  Vector,
  Container,
  getCollisions,
  getCirclesExcept,
  getRandomArbitrary,
  getRandomCoordinates,
  resolveBorderCollision,
  resolveCirclesCollision
} from '../utilities.js';
import { Circle } from './figures/index.js';

import FPSCounter from './fps-counter.js';

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

const settingsIcon = document.querySelector('.settings-icon');
const settingsModal = document.querySelector('.settings-modal');
const resetButton = settingsModal.querySelector('.btn-reset');
const applyButton = settingsModal.querySelector('.btn-apply');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();
let isSettingsShown = false;

window.addEventListener('resize', () => initialize());
resetButton.addEventListener('click', () => resetSettings());
settingsIcon.addEventListener('click', () => toggleSettings());

// settings
const defaultCollide = true;
const defaultAmountOfCircles = 100;
const defaultRadiusRange = new Range(5, 25);
const defaultSpeedRange = new Range(10, 60);

let circles = null;
let fpsCounter = null;

function toggleSettings() {
  const { style } = settingsModal;

  isSettingsShown = !isSettingsShown;

  if (!isSettingsShown) {
    style.visibility = 'hidden';

    return;
  }

  style.visibility = 'visible';
}

function resetSettings() {
  const amountElement = settingsModal.querySelector('#amount');
  const collideElement = settingsModal.querySelector('#collide');
  const minSpeedElement = settingsModal.querySelector('#minSpeed');
  const maxSpeedElement = settingsModal.querySelector('#maxSpeed');
  const minRadiusElement = settingsModal.querySelector('#minRadius');
  const maxRadiusElement = settingsModal.querySelector('#maxRadius');

  collideElement.checked = defaultCollide;
  amountElement.value = defaultAmountOfCircles;
  minSpeedElement.value = defaultSpeedRange.min;
  maxSpeedElement.value = defaultSpeedRange.max;
  minRadiusElement.value = defaultRadiusRange.min;
  maxRadiusElement.value = defaultRadiusRange.max;
}

function initialize() {
  container.width = canvas.width = window.innerWidth;
  container.height = canvas.height = window.innerHeight;
  circles = [];

  for (let index = 0; index < defaultAmountOfCircles; index++) {
    const radius = getRandomArbitrary(
      defaultRadiusRange.min,
      defaultRadiusRange.max
    );

    const newSpeedRange = Range.divide(defaultSpeedRange, radius);
    const speedFromTo = [-newSpeedRange.min, newSpeedRange.max];

    const dx = getRandomArbitrary(...speedFromTo);
    const dy = getRandomArbitrary(...speedFromTo);

    const position = getRandomCoordinates(circles, container, radius);

    if (!position) {
      break;
    }

    const velocity = new Vector(dx, dy);

    circles.push(new Circle(context, position, velocity, radius));
  }

  fpsCounter = new FPSCounter(context);
}

function processCircles(circles, circle) {
  const { radius, position } = circle;
  const collisions = getCollisions(
    getCirclesExcept(circles, circle),
    radius,
    position
  );

  collisions.forEach(colliding => resolveCirclesCollision(circle, colliding));

  resolveBorderCollision(circle, container.width, container.height);

  circle.update();
}

function animate() {
  requestAnimationFrame(animate);

  if (isSettingsShown) {
    return;
  }

  context.clearRect(0, 0, container.width, container.height);

  circles.forEach(c => processCircles(circles, c));
  fpsCounter.update();
}

initialize();
animate();
