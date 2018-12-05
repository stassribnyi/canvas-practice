import { TextLabel, TextAlignOptions } from '../../../shared.js';

const getScoreText = score => `Score: ${score}`;

export default class GameScore extends TextLabel {
  constructor(container, position, initialScore = 0) {
    super(
      container,
      position,
      getScoreText(initialScore),
      TextAlignOptions.END
    );

    this.score = initialScore;
  }

  decrement() {
    this.score--;
  }

  increment() {
    this.score++;

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
  }
  getCurrentScore() {
    return this.score;
  }

  resetScore() {
    this.score = 0;
  }

  update(score) {
    if (!!score && typeof score === 'number') {
      this.score = score;
    }

    super.update(getScoreText(this.score));
  }
}
