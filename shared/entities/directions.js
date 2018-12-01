export const Directions = Object.freeze({
  TOP: Symbol('top'),
  RIGHT: Symbol('right'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left'),
  getOpposite: function(direction) {
    switch (direction) {
      case Directions.TOP:
        return Directions.BOTTOM;
      case Directions.BOTTOM:
        return Directions.TOP;
      case Directions.RIGHT:
        return Directions.LEFT;
      case Directions.LEFT:
        return Directions.RIGHT;
      default:
        return null;
    }
  },
  areOpposite: function(directionOne, directionTwo) {
    const opposite = Directions.getOpposite(directionOne);

    if (opposite === null) {
      return false;
    }

    return opposite === directionTwo;
  }
});
