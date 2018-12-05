import { Colors, TextLabel } from '../../../../shared.js';
import MenuItemTypes from './item-types.js';
import MenuItem from './item.js';
import GameMenu from './menu.js';

const SCORE_PLACEHOLDER = 'Your Score: 0';
const BEST_SCORE_PLACEHOLDER = 'Best Score: 0';
const GAME_OVER_REASON_PLACEHOLDER = 'Game Over!';

export default class GameOverMenu extends GameMenu {
  constructor(
    container,
    position,
    width,
    height,
    victoryAchieved,
    score,
    bestScore,
    restartCallback
  ) {
    const reason = victoryAchieved ? 'You Win!' : 'You Lose!';

    const isNewRecordAchieved = score > bestScore;
    const scoreColor = isNewRecordAchieved ? Colors.GREEN : Colors.RED;

    const menuItems = [
      new MenuItem(reason, MenuItemTypes.TEXT),
      new MenuItem(
        `Your Score: ${score}`,
        MenuItemTypes.TEXT,
        null,
        scoreColor
      ),
      new MenuItem(
        `Best Score: ${bestScore}`,
        MenuItemTypes.TEXT,
        null,
        Colors.GREEN
      ),
      new MenuItem('Try Again!', MenuItemTypes.BUTTON, () => restartCallback())
    ];

    super(container, position, width, height, menuItems);
  }

  updateIfPossible(placeholder, value, color = null) {
    const itemToUpdate = this.items.find(
      item => item.labelText === placeholder
    );

    if (!itemToUpdate) {
      return;
    }

    if (itemToUpdate instanceof TextLabel && !!color) {
      itemToUpdate.foregroundColor = color;
    }

    itemToUpdate.update(value);
  }
}
