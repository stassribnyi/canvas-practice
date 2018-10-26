export class Range {
    constructor(min = 0, max = 1) {
      this.min = min;
      this.max = max;
    }
  
    static divide(a, b) {
      if (typeof b === 'number') {
        return new Range(a.min / b, a.max / b);
      }
  
      return new Range(a.min / b.min, a.max / b.max);
    }
  }