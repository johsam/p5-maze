/**
 * @typedef {import('p5')} P5
 */

// @ts-check

import Grid from './Grid.js';
import Generator from './Generator.js';
import AStarPathFinder from './AStarPathFinder.js';

export default class Maze {
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
        this.grid = new Grid(p, rows, cols, options);

        this.startCell = this.grid.cellAt(0, 0);
        this.startCell?.visit(true);
        this.startCell?.carveUp();

        this.endCell = this.grid.cellAt(rows - 1, cols - 1);
        this.endCell?.carveRight();

        this.cellsize = options.cellsize;

        this.astar = new AStarPathFinder(this.p, this.startCell, this.endCell);

        this.copied = false;

        /** @type {Generator[]} */
        this.generators = [];

        const alpha = 128;

        this.red = p.color([255, 0, 0, alpha]);
        this.green = p.color([0, 255, 0, alpha]);
        this.blue = p.color([0, 0, 255, alpha]);
        this.yellow = p.color([255, 230, 0, alpha]);
        this.black = p.color([0, 0, 0, alpha]);

        this.generators.push(new Generator(this.grid, 0, 0, this.red));
        //this.generators.push(new Generator(this.grid, 0, cols - 1, this.green));
        //this.generators.push(new Generator(this.grid, rows - 1, cols - 1, this.blue));
        //this.generators.push(new Generator(this.grid, rows - 1, 0, this.yellow));
        //this.generators.push(new Generator(this.grid, Math.floor(rows / 2), Math.floor(cols / 2), this.black));
    }

    reset() {
        this.copied = false;
        this.grid.reset();
        for (const generator of this.generators) {
            generator.reset();
        }

        this.astar.reset();
    }


    generated() {
        for (const generator of this.generators) {
            if (!generator.finished()) {
                return false;
            }
        }
        return true;
    }

    genStep() {
        for (const generator of this.generators) {
            for (let i = 0; i < 100; i++) {
                if (!generator.genStep()) {
                    break;
                }
            }
        }
    }

    draw() {
        this.grid.draw();

        for (const generator of this.generators) {
            generator.draw();
        }
    }

    drawAstarPath() {
        const path = this.astar.getPath();

        this.p.push();
        this.p.noFill();
        this.p.stroke(0, 0, 255, 48);
        this.p.strokeWeight(4);

        this.p.beginShape();
        for (const cell of path) {
            const { x, y } = cell.xy();
            this.p.curveVertex(x + this.cellsize / 2, y + this.cellsize / 2);
        }

        this.p.endShape();
        this.p.pop();

        for (const cell of this.astar.closedSet) {
            cell.solution(0, 255, 0, 128);
        }
    }
}
