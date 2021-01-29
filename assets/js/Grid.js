/**
 * @typedef {import('p5')} P5
 */

// @ts-check

import Cell from './Cell.js';

export default class Grid {
    /**
     *
     * @param {P5} p
     * @param {number} rows
     * @param {number} cols
     * @param {{cellmarginleft:number,cellmargintop:number,cellsize:number}} options
     */
    constructor(p, rows, cols, options) {
        this.p = p;
        this.rows = rows;
        this.cols = cols;
        /**
         * @type {Array.<Cell>}
         */
        this.grid = [];

        const { cellmarginleft, cellmargintop, cellsize } = options;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = new Cell(this.p, this, r, c, { cellmarginleft, cellmargintop, cellsize });
                this.grid.push(cell);
            }
        }
    }

    reset() {
        for (const cell of this.grid) {
            cell.reset();
        }
    }


    /**
     * @param   {number} row
     * @param   {number} col
     * @returns {Cell|undefined}
     */
    cellAt(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return undefined;
        } else {
            return this.grid[col + row * this.cols];
        }
    }

    /**
     * @param   {Cell} cell
     * @returns {Cell|undefined}
     */
    cellAbove(cell) {
        return this.cellAt(cell.row - 1, cell.col);
    }

    /**
     * @param   {Cell} cell
     * @returns {Cell|undefined}
     */
    cellBelow(cell) {
        return this.cellAt(cell.row + 1, cell.col);
    }

    /**
     * @param   {Cell} cell
     * @returns {Cell|undefined}
     */
    cellToRight(cell) {
        return this.cellAt(cell.row, cell.col + 1);
    }

    /**
     * @param   {Cell} cell
     * @returns {Cell|undefined}
     */
    cellToLeft(cell) {
        return this.cellAt(cell.row, cell.col - 1);
    }

    /**
     *
     * @param   {Cell|undefined} cell
     * @returns {Cell|undefined}
     */
    unvisitedNeigbourAt(cell) {
        const neigbours = [];

        const above = this.cellAbove(cell);
        const right = this.cellToRight(cell);
        const below = this.cellBelow(cell);
        const left = this.cellToLeft(cell);

        if (above && !above.visited) {
            neigbours.push(above);
        }

        if (right && !right.visited) {
            neigbours.push(right);
        }

        if (below && !below.visited) {
            neigbours.push(below);
        }

        if (left && !left.visited) {
            neigbours.push(left);
        }

        if (neigbours.length > 0) {
            return neigbours[Math.floor(this.p.random(0, neigbours.length))];
        }

        return undefined;
    }

    /**
     *
     * @param   {Cell|undefined} cell
     * @returns {boolean}
     */
    anyUnvisitedNeigbours(cell) {
        const above = this.cellAbove(cell);
        if (above && !above.visited) {
            return true;
        }

        const right = this.cellToRight(cell);
        if (right && !right.visited) {
            return true;
        }

        const below = this.cellBelow(cell);
        if (below && !below.visited) {
            return true;
        }

        const left = this.cellToLeft(cell);
        if (left && !left.visited) {
            return true;
        }

        return false;
    }

    draw() {
        for (const cell of this.grid) {
            cell.draw();
        }

        for (const cell of this.grid) {
            cell.drawWalls();
        }
    }
}
