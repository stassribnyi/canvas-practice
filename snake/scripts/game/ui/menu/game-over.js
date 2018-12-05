import { Colors } from '../../../../shared.js';

import MenuItemTypes from './item-types.js';
import MenuItem from './item.js';
import GameMenu from './menu.js';

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
}
