import { Colors, TextAlignOptions } from '../constants/index.js';
import { Position } from '../entities/index.js';
import { TextLabel } from './ui/index.js';

const F_KEY_CODE = 70;

export class FPSCounter extends TextLabel {
  constructor(container) {
    super(
      container,
      new Position(container.width / 2, 10),
      '',
      TextAlignOptions.CENTER,
      Colors.FOREGROUND
    );

    this.prevTime = new Date().getTime();
    this.framesPerSecond = 0;
    this.visible = false;
    this.counter = 0;

    this.toggle = this.toggle.bind(this);

    this.container.addEventListener('keydown', this.toggle);
  }

  toggle({ keyCode }) {
    if (keyCode !== F_KEY_CODE) {
      return;
    }

    this.visible = !this.visible;
  }

  update() {
    const currentTime = new Date().getTime();
    const millisecondsInSecond = 1000;

    if (millisecondsInSecond < currentTime - this.prevTime) {
      this.framesPerSecond = this.counter;
      this.prevTime = currentTime;
      this.counter = 0;
    } else {
      this.counter++;
    }

    if (!this.visible) {
      return;
    }

    super.update(`${this.framesPerSecond} FPS`);
  }

  destroy() {
    super.destroy();

    this.container.removeEventListener('keydown', this.toggle);
  }
}
