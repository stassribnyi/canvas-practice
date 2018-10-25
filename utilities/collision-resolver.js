import { isOutOfRange } from './helpers.js';
import { Vector } from './vector.js';

export function resolveBorderCollision(circle, width, height) {
  const { position, velocity, radius } = circle;

  const withRadius = Vector.sum(position, radius);
  const withoutRadius = Vector.subtract(position, radius);

  if (isOutOfRange(withoutRadius.x, withRadius.x, 0, width)) {
    velocity.x = -velocity.x;
  }

  if (isOutOfRange(withoutRadius.y, withRadius.y, 0, height)) {
    velocity.y = -velocity.y;
  }
}
