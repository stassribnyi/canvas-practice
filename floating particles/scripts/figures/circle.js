import { getRandomColor } from '../../utilities.js';

export class Circle {
  constructor(context, position, radius, color = getRandomColor()) {
    this.context = context;
    this.position = position;
    this.radius = radius;
    this.color = color;
  }

  get startAngle() {
    return 0;
  }

  get endAngle() {
    return  Math.PI * 2;
  }

  draw() {
    const { x, y } = this.position;

    this.context.beginPath();
    this.context.arc(x, y, this.radius, this.startAngle, this.endAngle, false);    
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.stroke();
  }

  update() {
    this.draw();
  }
}
