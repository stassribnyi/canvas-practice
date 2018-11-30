import { isPointWithinRectangle } from '../../../utilities/index.js';

export default class UIElement {
  constructor(container, position, width, height) {
    if (!(container instanceof HTMLCanvasElement)) {
      throw new Error('Container can only be a canvas element!');
    }

    this.container = container;
    this.context = container.getContext('2d');

    this.position = position;

    this.width = width;
    this.height = height;

    this.onClick = this.onClick.bind(this);

    this.eventListeners = new Map();

    this.registerClickHandler();
  }

  canBeClicked(point) {
    return isPointWithinRectangle(
      this.position,
      point,
      this.width,
      this.height
    );
  }

  onClick(event) {
    const { pageX, pageY } = event;
    const point = { x: pageX, y: pageY };

    if (this.canBeClicked(point) && this.eventListeners.has('click')) {
      const listeners = this.eventListeners.get('click');

      listeners.forEach(listener => listener());
    }
  }

  registerClickHandler() {
    this.container.addEventListener('click', this.onClick);
  }

  unregisterClickHandler() {
    this.container.removeEventListener('click', this.onClick);
  }

  addEventListener(eventType, listener) {
    if (this.eventListeners.has(eventType)) {
      const listeners = this.eventListeners.get(eventType);
      listeners.add(listener);
    } else {
      const listeners = new Set();
      listeners.add(listener);

      this.eventListeners.set(eventType, listeners);
    }
  }

  removeEventListener(eventType, listener) {
    if (this.eventListeners.has(eventType)) {
      const listeners = this.eventListeners.get(eventType);
      if (listeners.has(listener)) {
        listeners.delete(listener);
      }
    }
  }

  draw() {
    const { x, y } = this.position;

    this.context.fillRect(x, y, this.width, this.height);
  }

  update() {
      this.draw();
  }

  destroy() {
    this.eventListeners.clear();
    this.unregisterClickHandler();
  }
}
