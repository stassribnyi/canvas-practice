import { applyGravity, GravitySettings } from '../shared.js';

import { Container, FPSCounter, Particle, Vector } from '../shared.js';

const settingsIcon = document.querySelector('.settings-icon');
const settingsModal = document.querySelector('.settings-modal');

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
let gravitySettings = new GravitySettings(0.5, 0.9);
let particle = null;
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
  initialize();
}

function applySettings() {
  toggleSettings();
  initialize();
}

function initialize() {
  container.width = canvas.width = window.innerWidth;
  container.height = canvas.height = window.innerHeight;

  particle = new Particle(
    context,
    Vector.clone(container.center),
    new Vector(0, 0),
    10
  );
  fpsCounter = new FPSCounter(context);
}

function animate() {
  requestAnimationFrame(animate);

  if (isSettingsShown) {
    return;
  }

  context.clearRect(0, 0, container.width, container.height);
  context.font = '12px PressStart2P';

  particle.update();
  applyGravity(particle, container, gravitySettings);

  fpsCounter.update();
}

resetSettings();
animate();
