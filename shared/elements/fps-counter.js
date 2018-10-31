export class FPSCounter {
  constructor(context) {
    this.context = context;
    this.prevTime = new Date().getTime();
    this.framesPerSecond = 0;
    this.counter = 0;
  }

  draw() {
    const currentTime = new Date().getTime();
    const millisecondsInSecond = 1000;

    if (millisecondsInSecond < currentTime - this.prevTime) {
      this.framesPerSecond = this.counter;
      this.prevTime = currentTime;
      this.counter = 0;
    } else {
      this.counter++;
    }

    this.context.fillStyle = 'rgba(40, 44, 62, 0.63)';
    this.context.fillRect(24, 10, 85, 26);

    this.context.fillStyle = '#ffeac9';
    this.context.fillText(`${this.framesPerSecond} FPS`, 30, 30);
  }

  update() {
    this.draw();
  }
}
