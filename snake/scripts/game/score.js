import { TextLabel, TextAlignOptions } from '../../shared.js';

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

  increment() {
    this.score++;
  }

  decrement() {
    this.score--;
  }

  update(score) {
    if (!!score && typeof score === 'number') {
      this.score = score;
    }

    super.update(getScoreText(this.score));
  }
}
