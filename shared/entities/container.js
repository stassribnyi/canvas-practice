export class Container {
  constructor(width = null, height = null) {
    this.width = width;
    this.height = height;
  }

  get center() {
    return {
      width: this.width / 2,
      height: this.height / 2
    };
  }
}
