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
    const newVelocity = velocity.y * -bounceFactor;
    const preventInfinityBouncing = velocity.y + newVelocity < gravity;

    velocity.y = preventInfinityBouncing ? 0 : newVelocity;
    position.y = container.height - radius;
  } else {
    velocity.y += gravity;
  }
}
