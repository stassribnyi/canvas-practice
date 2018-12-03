import { TextLabel, TextAlignOptions } from '../../shared.js';

const getScoreText = score => `Score: ${score}`;
const getBestScoreText = score => (score > 0 ? `Best Score: ${score}` : '');

const bestScoreKey = 'best-snake-score';

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

  get bestScore() {
    const bestScore = Number(localStorage.getItem(bestScoreKey));

    return bestScore || 0;
  }

  set bestScore(score) {
    localStorage.setItem(bestScoreKey, score);
  }

  increment() {
    this.score++;

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
  }

  decrement() {
    this.score--;
  }

  update(score) {
    if (!!score && typeof score === 'number') {
      this.score = score;
    }

    const bestScoreText = getBestScoreText(this.bestScore);
    const scoreText = getScoreText(this.score);

    const allScoresText = !bestScoreText
      ? scoreText
      : `[ ${scoreText} ] - [ ${bestScoreText} ]`;

    super.update(allScoresText);
  }
}
