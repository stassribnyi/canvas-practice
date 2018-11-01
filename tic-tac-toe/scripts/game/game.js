import { Vector, Line } from '../../shared.js';
import { Cell, CellState } from './cell.js';

export class GameState {
  static get XWin() {
    return 'xWin';
  }

  static get OWin() {
    return 'oWin';
  }

  static get DeadHeat() {
    return 'deadHeat';
  }

  static get Playing() {
    return 'playing';
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
    this.context.lineWidth = this.cellSize / 20;
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
  }

  hoverCell(position) {
    this.cells.forEach(
      cell => (cell.contains(position) ? cell.hoverIn() : cell.hoverOut())
    );
  }

  reset() {
    this.buildFieldLines();
    this.buildFieldCells();
  }

  checkLine(line, state) {
    return line.every(cell => cell.state === state);
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

      isXWinner =
        this.checkLine(row, CellState.XSet) ||
        this.checkLine(column, CellState.XSet);
      isOWinner =
        this.checkLine(row, CellState.OSet) ||
        this.checkLine(column, CellState.OSet);

      if (isXWinner || isOWinner) {
        break;
      }
    }

    if (!isXWinner && !isOWinner) {
      isXWinner =
        this.checkLine(diagonal, CellState.XSet) ||
        this.checkLine(counterDiagonal, CellState.XSet);
      isOWinner =
        this.checkLine(diagonal, CellState.OSet) ||
        this.checkLine(counterDiagonal, CellState.OSet);
    }

    if (isXWinner || isOWinner) {
      return isXWinner ? GameState.XWin : GameState.OWin;
    }

    if (this.cells.every(cell => cell.state !== CellState.Unset)) {
      return GameState.GameState;
    }

    return GameState.Playing;
  }

  update() {
    this.draw();

    this.cells.forEach(c => c.update());
  }
}
