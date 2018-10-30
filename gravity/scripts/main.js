import {
  applyGravity,
  setRangeElement,
  getRandomArbitrary,
  getRandomCoordinates
} from '../shared.js';

import {
  Range,
  Vector,
  Particle,
  Container,
  FPSCounter,
  GravitySettings
} from '../shared.js';

const settingsIcon = document.querySelector('.settings-icon');
const settingsModal = document.querySelector('.settings-modal');

const amountElement = settingsModal.querySelector('#amount');
const bouncingFactorElement = settingsModal.querySelector('#bouncingFactor');
const gravityEnabledElement = settingsModal.querySelector('#gravityEnabled');
const accelerationElement = settingsModal.querySelector('#gravityAcceleration');

const resetButton = settingsModal.querySelector('.btn-reset');
const applyButton = settingsModal.querySelector('.btn-apply');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const container = new Container();
let isSettingsShown = false;

window.addEventListener('resize', () => initialize());

settingsIcon.addEventListener('click', () => toggleSettings());

applyButton.addEventListener('click', () => applySettings());
resetButton.addEventListener('click', () => {
  resetSettings();
  toggleSettings();
});

// settings
const scaleFactor = 100;
const defaultGravityEnabled = true;
const defaultAmountOfParticles = 50;
const defaultBouncingFactor = new Range(10, scaleFactor);
const defaultAcceleration = new Range(10, scaleFactor);

let amountOfParticles = defaultAmountOfParticles;
let gravityEnabled = defaultGravityEnabled;
let gravitySettings = new GravitySettings(
  defaultAcceleration.max / scaleFactor,
  defaultBouncingFactor.max / scaleFactor
);

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

function applyLocalSettings() {
  gravityEnabled = gravityEnabledElement.checked;
  amountOfParticles = Number(amountElement.value);

  const bouncingFactor = Number(bouncingFactorElement.value);
  const acceleration = Number(accelerationElement.value);

  gravitySettings = new GravitySettings(
    acceleration / scaleFactor,
    bouncingFactor / scaleFactor
  );
}

function resetSettings() {
  gravityEnabledElement.checked = defaultGravityEnabled;
  setRangeElement(amountElement, defaultAmountOfParticles, false);
  setRangeElement(accelerationElement, defaultAcceleration);
  setRangeElement(bouncingFactorElement, defaultBouncingFactor, false);
  applyLocalSettings();

  initialize();
}

function applySettings() {
  applyLocalSettings();
  toggleSettings();
  initialize();
}

function initialize() {
  container.width = canvas.width = window.innerWidth;
  container.height = canvas.height = window.innerHeight;

  particles = [];

  for (let index = 0; index < amountOfParticles; index++) {
    const radius = getRandomArbitrary(5, 25);
    const position = getRandomCoordinates(particles, container, radius);

    if (!position) {
      break;
    }

    particles.push(new Particle(context, position, new Vector(0, 0), radius));
  }

  fpsCounter = new FPSCounter(context);
}

function animate() {
  requestAnimationFrame(animate);

  if (isSettingsShown) {
    return;
  }

  context.font = '12px PressStart2P';
  context.fillStyle = 'rgba(40,44,62, 0.25)';
  context.fillRect(0, 0, container.width, container.height);

  particles.forEach(p => {
    p.update();

    if (gravityEnabled) {
      applyGravity(p, container, gravitySettings);
    }
  });

  fpsCounter.update();
}

resetSettings();
animate();
