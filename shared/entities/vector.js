export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  get length() {
    return Math.hypot(this.x, this.y);
  }

  static sum(a, b) {
    if (typeof b === 'number') {
      return new Vector(a.x + b, a.y + b);
    }

    return new Vector(a.x + b.x, a.y + b.y);
  }

  static subtract(a, b) {
    if (typeof b === 'number') {
      return new Vector(a.x - b, a.y - b);
    }

    return new Vector(a.x - b.x, a.y - b.y);
  }

  static multiply(a, b) {
    if (typeof b === 'number') {
      return new Vector(a.x * b, a.y * b);
    }

    return new Vector(a.x * b.x, a.y * b.y);
  }

  static clone(vector) {
    return new Vector(vector.x, vector.y);
  }
}
