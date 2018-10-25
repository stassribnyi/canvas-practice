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
