export default class Food {
  constructor(position, size) {
    this.position = position;
    this.size = size;
  }

  clone(newPosition = null) {
    return new Food(newPosition || this.position, this.size);
  }
}
