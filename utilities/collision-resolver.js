import { hasIntersections } from './helpers.js';
import { Vector } from './vector.js';

const { cos, sin } = Math;

function getPhi(p1, p2) {
  const positionDiff = Vector.subtract(p2, p1);

  return positionDiff.angle;
}

function getTheta(velocity) {
  return velocity.angle;
}

function getSpeed(velocity) {
  return velocity.length;
}

function getVelocityBase(v1, v2, m1, m2, t1, t2, phi) {
  const numerator =
    v1 * cos(t1 - phi) * (m1 - m2) + 2 * m2 * v2 * cos(t2 - phi);

  return numerator / (m1 + m2);
}

function getXVelocity(v1, v2, m1, m2, t1, t2, phi) {
  const velocityBase = getVelocityBase(v1, v2, m1, m2, t1, t2, phi);

  const velocityEnding = v1 * sin(t1 - phi) * sin(phi);

  return velocityBase * cos(phi) - velocityEnding;
}

function getYVelocity(v1, v2, m1, m2, t1, t2, phi) {
  const velocityBase = getVelocityBase(v1, v2, m1, m2, t1, t2, phi);

  const velocityEnding = v1 * sin(t1 - phi) * cos(phi);

  return velocityBase * sin(phi) + velocityEnding;
}

function pushParticlesApart(p1, p2, m1, m2, r1, r2) {
  const positionDiff = Vector.subtract(p1, p2);
  const distance = positionDiff.length;

  // minimum translation distance to push particles apart after intersecting
  const mtd = Vector.multiply(positionDiff, (r1 + r2 - distance) / distance);

  const inverseMass1 = 1 / m1;
  const inverseMass2 = 1 / m2;
  const inverseMassSum = inverseMass1 + inverseMass2;

  // push-pull them apart based off their mass
  const p1Diff = Vector.multiply(mtd, inverseMass1 / inverseMassSum);
  const p2Diff = Vector.multiply(mtd, inverseMass2 / inverseMassSum);

  return {
    p1: Vector.sum(p1, p1Diff),
    p2: Vector.subtract(p2, p2Diff)
  };
}

export function resolveBorderCollision(particle, width, height) {
  const { position, velocity, radius } = particle;

  const withRadius = Vector.sum(position, radius);
  const withoutRadius = Vector.subtract(position, radius);

  if (hasIntersections(withoutRadius.x, withRadius.x, 0, width)) {
    velocity.x = -velocity.x;
  }

  if (hasIntersections(withoutRadius.y, withRadius.y, 0, height)) {
    velocity.y = -velocity.y;
  }
}

export function getCollisions(particles, radius, position) {
  return particles.filter(p => {
    const positionDiff = Vector.subtract(position, p.position);
    const distance = positionDiff.length;

    return distance <= p.radius + radius;
  });
}

export function hasCollision(particles, radius, position) {
  return getCollisions(particles, radius, position).length > 0;
}

export function resolveParticlesCollision(pt1, pt2) {
  const { velocity: v1, position: p1, mass: m1, radius: r1 } = pt1;
  const { velocity: v2, position: p2, mass: m2, radius: r2 } = pt2;

  const phi = getPhi(p1, p2);

  const s1 = getSpeed(v1);
  const s2 = getSpeed(v2);

  const t1 = getTheta(v1);
  const t2 = getTheta(v2);

  pt1.velocity = new Vector(
    getXVelocity(s1, s2, m1, m2, t1, t2, phi),
    getYVelocity(s1, s2, m1, m2, t1, t2, phi)
  );

  pt2.velocity = new Vector(
    getXVelocity(s2, s1, m2, m1, t2, t1, phi),
    getYVelocity(s2, s1, m2, m1, t2, t1, phi)
  );

  const coordinates = pushParticlesApart(p1, p2, m1, m2, r1, r2);

  pt1.position = coordinates.p1;
  pt2.position = coordinates.p2;
}
