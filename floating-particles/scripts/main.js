import { setRangeElement, DEFAULT_FONT, setCanvasScaling } from '../shared.js';

import { Range, Vector, Particle, Container, FPSCounter } from '../shared.js';

import {
  getCollisions,
  getParticlesExcept,
  getRandomArbitrary,
  getRandomCoordinates
} from '../shared.js';

import {
  resolveBorderCollision,
  resolveParticlesCollision
} from '../shared.js';

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

settingsIcon.addEventListener('click', () => toggleSettings());

minSpeedElement.addEventListener('input', () =>
  normalizeRange(minSpeedElement, maxSpeedElement)
);
maxSpeedElement.addEventListener('input', () =>
  normalizeRange(minSpeedElement, maxSpeedElement, false)
);

minRadiusElement.addEventListener('input', () =>
  normalizeRange(minRadiusElement, maxRadiusElement)
);
maxRadiusElement.addEventListener('input', () =>
  normalizeRange(minRadiusElement, maxRadiusElement, false)
);

applyButton.addEventListener('click', () => applySettings());
resetButton.addEventListener('click', () => {
  resetSettings();
  toggleSettings();
});

// settings
const defaultCollide = true;
const defaultAmountOfParticles = 200;
const defaultRadiusRange = new Range(5, 25);
const defaultSpeedRange = new Range(10, 60);

let collide = defaultCollide;
let amountOfParticles = defaultAmountOfParticles;
let radiusRange = defaultRadiusRange;
let speedRange = defaultSpeedRange;

let particles = null;
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

function normalizeRange(minRange, maxRange, isMinChanged = true) {
  const min = Number(minRange.value);
  const max = Number(maxRange.value);

  if (isMinChanged && max <= min) {
    maxRange.value = min;
  }

  if (!isMinChanged && max <= min) {
    minRange.value = max;
  }
}

function applyLocalSettings() {
  collide = collideElement.checked;
  amountOfParticles = Number(amountElement.value);
  speedRange = new Range(
    Number(minSpeedElement.value),
    Number(maxSpeedElement.value)
  );
  radiusRange = new Range(
    Number(minRadiusElement.value),
    Number(maxRadiusElement.value)
  );
}

function resetSettings() {
  collideElement.checked = defaultCollide;
  setRangeElement(amountElement, defaultAmountOfParticles, false);
  setRangeElement(minSpeedElement, defaultSpeedRange);
  setRangeElement(maxSpeedElement, defaultSpeedRange, false);
  setRangeElement(minRadiusElement, defaultRadiusRange);
  setRangeElement(maxRadiusElement, defaultRadiusRange, false);
  applyLocalSettings();

  initialize();
}

function applySettings() {
  applyLocalSettings();
  toggleSettings();
  initialize();
}

function initialize() {
  setCanvasScaling(container, canvas)

  particles = [];

  for (let index = 0; index < amountOfParticles; index++) {
    const radius = getRandomArbitrary(radiusRange.min, radiusRange.max);

    const newSpeedRange = Range.divide(speedRange, radius);
    const speedFromTo = [-newSpeedRange.min, newSpeedRange.max];

    const dx = getRandomArbitrary(...speedFromTo);
    const dy = getRandomArbitrary(...speedFromTo);

    const position = getRandomCoordinates(particles, container, radius);

    if (!position) {
      break;
    }

    const velocity = new Vector(dx, dy);

    particles.push(new Particle(context, position, velocity, radius));
  }

  fpsCounter = new FPSCounter(canvas);
}

function processParticles(particles, particle) {
  if (collide) {
    const { radius, position } = particle;

    const collisions = getCollisions(
      getParticlesExcept(particles, particle),
      radius,
      position
    );

    collisions.forEach(colliding =>
      resolveParticlesCollision(particle, colliding)
    );
  }

  resolveBorderCollision(particle, container);

  particle.update();
}

function animate() {
  requestAnimationFrame(animate);

  if (isSettingsShown) {
    return;
  }

  context.clearRect(0, 0, container.width, container.height);
  context.font = DEFAULT_FONT;

  particles.forEach(p => processParticles(particles, p));
  fpsCounter.update();
}

resetSettings();
animate();
