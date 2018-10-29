import { getRandomColor, Vector } from '../../utilities.js';

export class Particle {
  constructor(context, position, velocity, radius, color = getRandomColor()) {
    this.context = context;

    this.position = position;
    this.velocity = velocity;

    this.radius = radius;
    this.mass = radius;

    this.color = color;
  }

  get startAngle() {
    return 0;
  }

  get endAngle() {
    return Math.PI * 2;
  }

  draw() {
    const { x, y } = this.position;

    this.context.beginPath();
    this.context.arc(x, y, this.radius, this.startAngle, this.endAngle, false);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.stroke();
  }

  move() {
    this.position = Vector.sum(this.position, this.velocity);
  }

  update() {
    this.move();
    this.draw();
  }
}
