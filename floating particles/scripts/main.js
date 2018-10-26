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

const amountElement = settingsModal.querySelector('#amount');
const collideElement = settingsModal.querySelector('#collide');
const minSpeedElement = settingsModal.querySelector('#minSpeed');
const maxSpeedElement = settingsModal.querySelector('#maxSpeed');
const minRadiusElement = settingsModal.querySelector('#minRadius');
const maxRadiusElement = settingsModal.querySelector('#maxRadius');

const resetButton = settingsModal.querySelector('.btn-reset');
const applyButton = settingsModal.querySelector('.btn-apply');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();
let isSettingsShown = false;


window.addEventListener('resize', () => initialize());
resetButton.addEventListener('click', () => resetSettings());
applyButton.addEventListener('click', () => applySettings());
settingsIcon.addEventListener('click', () => toggleSettings());

// settings
const defaultCollide = true;
const defaultAmountOfCircles = 200;
const defaultRadiusRange = new Range(5, 25);
const defaultSpeedRange = new Range(10, 60);

let collide = defaultCollide;
let amountOfCircles = defaultAmountOfCircles;
let radiusRange = defaultRadiusRange;
let speedRange = defaultSpeedRange;

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

function setRangeElement(element, value, minAsDefault = true) {
  let range = value;
  if (typeof value === 'number') {
    range = {
      min: 1,
      max: value
    }
  }

  element.min = range.min;
  element.max = range.max;
  element.value = minAsDefault ? range.min : range.max;
}

function resetSettings() {
  collideElement.checked = defaultCollide;
  setRangeElement(amountElement, defaultAmountOfCircles, false);
  setRangeElement(minSpeedElement, defaultSpeedRange);
  setRangeElement(maxSpeedElement, defaultSpeedRange, false);
  setRangeElement(minRadiusElement, defaultRadiusRange);
  setRangeElement(maxRadiusElement, defaultRadiusRange, false);

  initialize();
}

function applySettings() {
  collide = collideElement.checked;
  amountOfCircles = Number(amountElement.value);
  speedRange = new Range(Number(minSpeedElement.value), Number(maxSpeedElement.value));
  radiusRange = new Range(Number(minRadiusElement.value), Number(maxRadiusElement.value));

  toggleSettings();
  initialize();
}

function initialize() {
  container.width = canvas.width = window.innerWidth;
  container.height = canvas.height = window.innerHeight;
  circles = [];

  for (let index = 0; index < amountOfCircles; index++) {
    const radius = getRandomArbitrary(
      radiusRange.min,
      radiusRange.max
    );

    const newSpeedRange = Range.divide(speedRange, radius);
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
  if (collide) {
    const { radius, position } = circle;

    const collisions = getCollisions(
      getCirclesExcept(circles, circle),
      radius,
      position
    );

    collisions.forEach(colliding => resolveCirclesCollision(circle, colliding));
  }

  resolveBorderCollision(circle, container.width, container.height);

  circle.update();
}

function animate() {
  requestAnimationFrame(animate);
  context.font = '12px PressStart2P';

  if (isSettingsShown) {
    return;
  }

  context.clearRect(0, 0, container.width, container.height);

  circles.forEach(c => processCircles(circles, c));
  fpsCounter.update();
}

resetSettings();
animate();
