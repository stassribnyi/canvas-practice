export class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    static sum(a, b) {
      if (typeof b === "number") {
        return new Vector(a.x + b, a.y + b);
      }
  
      return new Vector(a.x + b.x, a.y + b.y);
    }

    static subtract(a, b) {
      if (typeof b === "number") {
        return new Vector(a.x - b, a.y - b);
      }
  
      return new Vector(a.x - b.x, a.y - b.y);
    }  
  }
  