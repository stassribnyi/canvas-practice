import { Vector, Line, TextControl } from '../../shared.js';
import { Cell, CellState } from './cell.js';

export class GameState {
  static get XWin() {
    return 'X Win!';
  }

  static get OWin() {
    return '0 Win!';
  }

  static get Draw() {
    return 'Draw!';
  }

  static get XTurn() {
    return 'X Turn';
  }

  static get OTurn() {
    return '0 Turn';
  }
}

export class TicTacToeGame {
  constructor(context, position, fieldSize, cellSize) {
    this.context = context;
    this.position = position;
    this.fieldSize = fieldSize;
    this.cellSize = cellSize;

    this.reset();
  }

  get letterLength() {
    return 6;
  }

  get upperCaseFactor() {
    return 2;
  }

  get letterHight() {
    return this.letterLength * 2;
  }

  buildControls() {
    this.resetControl = null;
    this.infoControl = null;
    const resetLabel = 'RESET';

    const { x, y } = this.position;
    const length = this.cellSize * this.fieldSize;
    const middle = length / 2;

    const stateWordLength = this.state.length * this.letterLength;
    const resetWordLength =
      resetLabel.length * this.letterLength * this.upperCaseFactor;

    const stateShift = middle - this.state.length * this.letterLength;
    const resetShift = middle - resetLabel.length * this.letterLength;

    const infoPosition = new Vector(x + stateShift, y - this.context.lineWidth * 2);

    const lineWidthShift = this.context.lineWidth * 4;

    const resetPosition = new Vector(
      x + resetShift,
      y + length + lineWidthShift
    );

    this.resetControl = new TextControl(
      this.context,
      resetLabel,
      resetPosition,
      resetWordLength,
      this.letterHight * this.upperCaseFactor
    );

    this.infoControl = new TextControl(
      this.context,
      this.state,
      infoPosition,
      stateWordLength,
      this.letterHight
    );
  }

  buildFieldLines() {
    this.verticalLines = [];
    this.horizontalLines = [];

    const fieldLength = this.cellSize * this.fieldSize;

    for (let i = 1; i < this.fieldSize; i++) {
      const shift = i * this.cellSize;

      const xStart = this.position.x + shift;
      const yStart = this.position.y + shift;

      const vlStart = new Vector(xStart, this.position.y);
      const vlEnd = new Vector(xStart, this.position.y + fieldLength);

      const hlStart = new Vector(this.position.x, yStart);
      const hlEnd = new Vector(this.position.x + fieldLength, yStart);

      this.verticalLines.push(new Line(vlStart, vlEnd));
      this.horizontalLines.push(new Line(hlStart, hlEnd));
    }
  }

  buildFieldCells() {
    this.cells = [];

    const cellSize = this.cellSize;

    for (let y = 0; y < this.fieldSize; y++) {
      for (let x = 0; x < this.fieldSize; x++) {
        const cellPosition = Vector.sum(
          this.position,
          new Vector(x * cellSize, y * cellSize)
        );

        const cell = new Cell(this.context, cellPosition, cellSize, cellSize);

        this.cells.push(cell);
      }
    }
  }

  drawLine(from, to) {
    this.context.strokeStyle = '#37ad83';

    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }

  draw() {
    for (let i = 0; i < this.fieldSize - 1; i++) {
      const vl = this.verticalLines[i];
      const hl = this.horizontalLines[i];

      this.drawLine(vl.start, vl.end);
      this.drawLine(hl.start, hl.end);
    }

    this.infoControl.update(this.state);
    this.resetControl.update();
  }

  canCellBeClicked(cell, position) {
    return cell.state === CellState.Unset && cell.contains(position);
  }

  canBeClicked(position) {
    const isAboveCell = this.cells.some(cell =>
      this.canCellBeClicked(cell, position)
    );
    const isAboveReset = this.resetControl.contains(position);

    return isAboveCell || isAboveReset;
  }

  hoverCell(position) {
    this.cells.forEach(
      cell =>
        this.canCellBeClicked(cell, position) ? cell.hoverIn() : cell.hoverOut()
    );
  }

  handleClick(position) {
    const resetClicked = this.resetControl.contains(position);

    if (resetClicked) {
      this.reset();

      return;
    }

    this.makeTurn(position);
  }

  makeTurn(position) {
    if (this.state !== GameState.XTurn && this.state !== GameState.OTurn) {
      return;
    }

    const clicked = this.cells.find(cell => cell.contains(position));

    if (clicked && clicked.state === CellState.Unset) {
      const isXTurn = this.state === GameState.XTurn;

      clicked.state = isXTurn ? CellState.XSet : CellState.OSet;

      this.state = isXTurn ? GameState.OTurn : GameState.XTurn;
    }

    this.checkWinner();
  }

  reset() {
    this.context.lineWidth = this.cellSize / 20;
    this.state = GameState.XTurn;

    this.buildFieldLines();
    this.buildFieldCells();
    this.buildControls();
  }

  checkLine(line, state) {
    return line.every(cell => cell.state === state);
  }

  someLineCrossedBy(lines) {
    return {
      crosses: lines.some(line => this.checkLine(line, CellState.XSet)),
      noughts: lines.some(line => this.checkLine(line, CellState.OSet))
    };
  }

  checkWinner() {
    let isXWinner = false;
    let isOWinner = false;

    const diagonal = [];
    const counterDiagonal = [];

    for (let y = 0; y < this.fieldSize; y++) {
      const row = [];
      const column = [];

      const rowStart = y * this.fieldSize;

      for (let x = 0; x < this.fieldSize; x++) {
        const rowCell = this.cells[rowStart + x];
        const columnCell = this.cells[this.fieldSize * x + y];

        if (x === y) {
          diagonal.push(rowCell);
        }

        if (x + y === this.fieldSize - 1) {
          counterDiagonal.push(rowCell);
        }

        column.push(columnCell);
        row.push(rowCell);
      }

      const crossedBy = this.someLineCrossedBy([row, column]);
      isXWinner = crossedBy.crosses;
      isOWinner = crossedBy.noughts;

      if (isXWinner || isOWinner) {
        break;
      }
    }

    if (!isXWinner && !isOWinner) {
      const crossedBy = this.someLineCrossedBy([diagonal, counterDiagonal]);
      isXWinner = crossedBy.crosses;
      isOWinner = crossedBy.noughts;
    }

    if (isXWinner || isOWinner) {
      this.state = isXWinner ? GameState.XWin : GameState.OWin;
    } else if (this.cells.every(cell => cell.state !== CellState.Unset)) {
      this.state = GameState.Draw;
    }
  }

  update() {
    this.draw();

    this.cells.forEach(c => c.update());
  }
}
