const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

window.addEventListener('resize', () => initialize());

function initialize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

initialize();