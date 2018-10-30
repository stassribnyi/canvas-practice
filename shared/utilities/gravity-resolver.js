import { hasIntersections } from '../utilities/index.js';
import { Vector } from '../entities/index.js';

const { round } = Math;

export class GravitySettings {
  constructor(gravityAcceleration, bouncingFactor) {
    this.gravityAcceleration = gravityAcceleration;
    this.bouncingFactor = bouncingFactor;
  }
}

export function applyGravity(particle, container, settings) {
  const { position, velocity, radius } = particle;
  const { gravityAcceleration, bouncingFactor } = settings;

  const withRadius = Vector.sum(position, radius);
  const withoutRadius = Vector.subtract(position, radius);

  if (hasIntersections(withoutRadius.y, withRadius.y, 0, container.height)) {
    velocity.y = velocity.y * -bouncingFactor;

    // if stuck push to border
    if (withRadius.y + velocity.y > container.height) {
      velocity.y = 0;
      position.y = container.height - radius;
    }
  } else {
    velocity.y = velocity.y + gravityAcceleration;
  }
}
