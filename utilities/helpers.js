const { floor, random } = Math;

export function getRandomColor() {
  const decimalWhite = 16777215;
  const decimalColor = floor(random() * decimalWhite);
  const hexColor = decimalColor.toString(16);

  return `#${hexColor}`;
}

export function isOutOfRange(minValue, maxValue, minRange, maxRange) {
  return minValue <= minRange || maxRange <= maxValue;
}
