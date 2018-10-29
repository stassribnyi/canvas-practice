import { hasIntersections } from '../utilities/index.js';
import { Vector } from '../entities/index.js';

export class GravitySettings {
  constructor(gravity, bounceFactor) {
    this.gravity = gravity;
    this.bounceFactor = bounceFactor;
  }
}

export function applyGravity(particle, container, settings) {
  const { position, velocity, radius } = particle;
  const { gravity, bounceFactor } = settings;

  const withRadius = Vector.sum(position, radius);
  const withoutRadius = Vector.subtract(position, radius);

  if (hasIntersections(withoutRadius.y, withRadius.y, 0, container.height)) {
    velocity.y = -velocity.y * bounceFactor;
  } else {
    velocity.y += gravity;
  }
}
