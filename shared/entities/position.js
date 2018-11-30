export class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static sum(a, b) {
    if (typeof b === 'number') {
      return new Position(a.x + b, a.y + b);
    }

    return new Position(a.x + b.x, a.y + b.y);
  }

  static clone(position) {
    return new Position(position.x, position.y);
  }
}
