import { hasCollision } from './collision-resolver.js';
import { Vector } from '../entities/index.js';

const { floor, random } = Math;

export function getRandomColor() {
  const decimalWhite = 16777215;
  const decimalColor = floor(random() * decimalWhite);
  const hexColor = decimalColor.toString(16);

  return `#${hexColor}`;
}

export function hasIntersections(minValue, maxValue, minRange, maxRange) {
  return minValue <= minRange || maxRange <= maxValue;
}

export function getRandomArbitrary(min, max) {
  const diff = max - min;

  return random() * diff + min;
}

export function getRandomInt(min, max) {
  const diff = max - min;

  return floor(random() * (diff + 1)) + min;
}

export function getParticlesExcept(particles, particle) {
  return particles.filter(p => p !== particle);
}

export function setRangeElement(element, value, minAsDefault = true) {
  let range = value;
  if (typeof value === 'number') {
    range = {
      min: 1,
      max: value
    };
  }

  element.min = range.min;
  element.max = range.max;
  element.value = minAsDefault ? range.min : range.max;
}

export function isPointWithinRectangle(position, point, width, height) {
  const { x, y } = position;
  const { x: px, y: py } = point;

  const isWithinXArea = x <= px && px <= x + width;
  const isWithinYArea = y <= py && py <= y + height;

  return isWithinXArea && isWithinYArea;
}

export function getRandomCoordinates(particles, container, radius) {
  let hasInteractions = false;
  let position = new Vector(0, 0);
  let attempt = 0;
  const maxAttempts = 10000;

  const limits = new Vector(container.width, container.height);

  const { x: maxX, y: maxY } = Vector.subtract(limits, radius);

  let hasAttempts;

  do {
    hasAttempts = attempt < maxAttempts;

    if (!hasAttempts) {
      break;
    }

    position.x = getRandomInt(radius, maxX);
    position.y = getRandomInt(radius, maxY);

    hasInteractions = hasCollision(particles, radius, position);

    attempt++;
  } while (hasInteractions);

  return hasAttempts ? position : null;
}
