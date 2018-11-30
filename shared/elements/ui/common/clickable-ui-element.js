import { isPointWithinRectangle } from '../../../utilities/index.js';

import UIElement from './ui-element.js';

export default class ClickableUIElement extends UIElement {
  constructor(container, position, width, height) {
    super(container, position, width, height);

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

  destroy() {
    super.destroy();

    this.eventListeners.clear();
    this.unregisterClickHandler();
  }
}
