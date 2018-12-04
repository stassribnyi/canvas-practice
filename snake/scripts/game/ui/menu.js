import {
  Colors,
  Button,
  Position,
  TextLabel,
  UIElement,
  drawRoundedRect,
  getRGBAFromRGBColor
} from '../../../shared.js';

const DEFAULT_MENU_PADDING = 15;

const MenuItemTypes = Object.freeze({
  BUTTON: Symbol('button'),
  TEXT: Symbol('text')
});

export class MenuItem {
  constructor(labelText, type, callback = null) {
    this.callback = callback;
    this.labelText = labelText;
    this.type = type;
  }
}

export default class GameMenu extends UIElement {
  constructor(
    container,
    position,
    width,
    height,
    padding = DEFAULT_MENU_PADDING
  ) {
    super(container, null, null, null);

    // stub items
    const menuItems = [
      new MenuItem('Restart', MenuItemTypes.BUTTON),
      new MenuItem('New Game', MenuItemTypes.BUTTON),
      new MenuItem('Resume', MenuItemTypes.BUTTON)
    ];

    const { totalWidth, totalHeight, measuredItems } = this.measureBoundaries(
      menuItems,
      padding
    );

    this.width = totalWidth;
    this.height = totalHeight;

    this.position = this.getCentralPosition(
      position,
      width,
      height,
      this.width,
      this.height
    );

    this.items = this.createMenuItems(
      container,
      this.position,
      this.width,
      this.height,
      measuredItems,
      padding
    );
  }

  createMenuItems(container, position, width, height, measuredItems, padding) {
    const items = [];

    for (let i = 0; i < measuredItems.length; i++) {
      const current = measuredItems[i];
      const previousItem = i !== 0 ? items[items.length - 1] : null;

      const horizontalPosition =
        position.x + width / 2 - current.size.width / 2;

      const verticalPosition = !previousItem
        ? position.y
        : previousItem.position.y + current.size.height;

      const itemPosition = new Position(
        horizontalPosition,
        verticalPosition + padding
      );

      const item = this.createMenuItem(container, itemPosition, current.item);

      if (!item) {
        continue;
      }

      items.push(item);
    }

    return items;
  }

  createMenuItem(container, position, item) {
    switch (item.type) {
      case MenuItemTypes.BUTTON: {
        const button = new Button(container, position, item.labelText);
        button.addEventListener('click', item.callback);

        return button;
      }
      case MenuItemTypes.TEXT:
        return new TextLabel(container, position, item.labelText);
      default:
        null;
    }
  }

  getCentralPosition(
    initialPosition,
    availableWidth,
    availableHeight,
    actualWidth,
    actualHeight
  ) {
    return new Position(
      initialPosition.x + (availableWidth / 2 - actualWidth / 2),
      initialPosition.y + (availableHeight / 2 - actualHeight / 2)
    );
  }

  measureBoundaries(menuItems, margin) {
    const measuredItems = menuItems.map(item => {
      const size = Button.measureButton(this.context, item.labelText);

      return {
        size,
        item
      };
    });

    const maxItemWidth = Math.max(
      ...measuredItems.map(({ size }) => size.width)
    );

    const itemsHeight = measuredItems.reduce(
      (total, current) => total + current.size.height,
      0
    );

    // total items margin (before each and for last one)
    const itemsMargin = measuredItems.length * margin + margin;

    return {
      measuredItems,
      totalWidth: maxItemWidth + margin * 2,
      totalHeight: itemsHeight + itemsMargin
    };
  }

  draw() {
    const oldFillStyle = this.context.fillStyle;
    const oldStrokeStyle = this.context.strokeStyle;

    this.context.fillStyle = getRGBAFromRGBColor(Colors.DARK, 0.5);
    this.context.strokeStyle = Colors.FOREGROUND;

    drawRoundedRect(this.context, this.position, this.width, this.height, 4);

    this.context.fill();
    this.context.stroke();

    this.context.fillStyle = oldFillStyle;
    this.context.strokeStyle = oldStrokeStyle;
  }

  update() {
    this.draw();

    this.items.forEach(i => i.update());
  }
}
