export function drawRoundedRect(context, position, width, height, radius) {
  const { x, y } = position;

  if (width < 2 * radius) {
    radius = width / 2;
  }

  if (height < 2 * radius) {
    radius = height / 2;
  }

  context.beginPath();

  context.moveTo(x + radius, y);

  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);

  context.closePath();
}
