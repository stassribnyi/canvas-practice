import { Vector } from './vector.js';

// TODO: this should probably be a wrapper over canvas/context
export class Container {
  constructor(width = null, height = null) {
    this.width = width;
    this.height = height;
  }

  get center() {
    return new Vector(this.width / 2, this.height / 2);
  }
}
