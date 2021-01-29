/**
 * @typedef {import('p5')} P5
 */

/**
 * @typedef {import('p5').Color} Color
 */

// @ts-check

// eslint-disable-next-line no-unused-vars
import Grid from './Grid.js';
// eslint-disable-next-line no-unused-vars
import Cell from './Cell.js';

export default class Generator {
    /**
     *
     * @param {Grid} grid
     * @param {number} startx
     * @param {number} starty
     * @param {Color} color
     */
    constructor(grid, startx, starty, color) {
        this.startx = startx;
        this.starty = starty;
        this.grid = grid;
        this.color = color;

        this.reset();
    }

    reset() {
        /**
         * @type {Array.<Cell|undefined>}
         */
        this.stack = [];

        this.current = this.grid.cellAt(this.startx, this.starty);
        this.current?.visit(true);
        this.done = false;
    }

    cleanupStack() {
        // Don't remove the first entry...
        for (let s = this.stack.length - 1; s > 0; s--) {
            if (!this.grid.anyUnvisitedNeigbours(this.stack[s])) {
                this.stack.splice(s, 1);
            }
        }
    }

    genStep() {
        if (!this.done) {
            const next = this.grid.unvisitedNeigbourAt(this.current);
            if (next) {
                this.stack.push(this.current);
                this.current?.carveTo(next);
                this.current = next;
                this.current.visit(true);
            } else {
                this.cleanupStack();

                if (this.stack.length > 0) {
                    //this.stack = this.stack.sort(() => Math.random() - 0.5)

                    this.current = this.stack.pop();
                } else {
                    this.current = undefined;
                    this.done = true;
                }
                return false;
            }
        }
        return true;
    }

    finished() {
        return this.done;
    }

    draw() {
        for (const cell of this.stack) {
            cell?.stack(this.color);
        }

        if (this.current) {
            this.current.higlight(this.color);
        }
    }
}
