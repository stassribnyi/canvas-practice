import { hasIntersections } from './helpers.js';
import { Vector } from './vector.js';

export function resolveBorderCollision(circle, width, height) {
  const { position, velocity, radius } = circle;

  const withRadius = Vector.sum(position, radius);
  const withoutRadius = Vector.subtract(position, radius);

  if (hasIntersections(withoutRadius.x, withRadius.x, 0, width)) {
    velocity.x = -velocity.x;
  }

  if (hasIntersections(withoutRadius.y, withRadius.y, 0, height)) {
    velocity.y = -velocity.y;
  }
}

export function getCollisions(circles, radius, position) {
  return circles.filter(c => {
    const positionDiff = Vector.subtract(position, c.position);
    const distance = positionDiff.length;
    return distance <= c.radius + radius;
  });
}

export function hasCollision(circles, radius, position) {
  return getCollisions(circles, radius, position).length > 0;
}
