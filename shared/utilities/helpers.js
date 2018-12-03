import { hasCollision } from './collision-resolver.js';
import { Vector, Directions } from '../entities/index.js';

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

export function getSwipeDirection(initialTouch, currentTouch) {
  if (initialTouch === null) {
    return null;
  }

  const { clientX: cx, clientY: cy } = currentTouch;
  const { clientX: ix, clientY: iy } = initialTouch;

  const diffX = ix - cx;
  const diffY = iy - cy;

  const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);

  return isHorizontalSwipe
    ? diffX > 0
      ? Directions.LEFT
      : Directions.RIGHT
    : diffY > 0
    ? Directions.TOP
    : Directions.BOTTOM;
}

export function getKeyDirection(keyCode) {
  switch (keyCode) {
    case 38:
    case 87:
      return Directions.TOP;
    case 39:
    case 68:
      return Directions.RIGHT;
    case 37:
    case 65:
      return Directions.LEFT;
    case 40:
    case 83:
      return Directions.BOTTOM;
    default:
      return null;
  }
}

export function getDarkerRGBColor(input, percent) {
  const split = input
    .split('(')[1]
    .split(')')[0]
    .split(',')
    .map(number => (Number(number) || 0) * percent);

  if (split.length === 3 || split.length === 4) {
    const isRgba = split.length === 4;

    return `${isRgba ? 'rgba' : 'rgb'}(${split[0]}, ${split[1]}, ${split[2]})`;
  }

  return 'rgb(0, 0, 0)';
}
