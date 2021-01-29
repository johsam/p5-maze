/**
 * @typedef {import('p5')} P5
 */

/**
 * @typedef {import('p5').Color} Color
 */

const WALL_TOP = 0;
const WALL_RIGHT = 1;
const WALL_BOTTOM = 2;
const WALL_LEFT = 3;

export default class Cell {
    /**
     *
     * @param {P5} p
     * @param {object} grid
     * @param {number} row
     * @param {number} col
     * @param {object} opt
     */
    constructor(p, grid, row, col, opt) {
        const { cellmarginleft, cellmargintop, cellsize } = opt;

        this.p = p;
        this.grid = grid;
        this.row = row;
        this.col = col;
        this.cellmarginleft = cellmarginleft;
        this.cellmargintop = cellmargintop;
        this.cellsize = cellsize;
        this.visitedColor = p.color(240);
        this.borderColor = p.color(128);

        this.reset()
    }

    reset() {
        this.walls = [true, true, true, true];
        this.visited = false;

        /* For astar*/

        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.previous = undefined;
    }


    /**
     * For astar
     * @param {Cell} other
     * @returns {number}
     */
    manhattanDistanceTo(other) {
        return Math.abs(this.col - other.col) + Math.abs(this.row - other.row);
    }

    /**
     * For astar
     * @returns {Array<Cell>}
     */
    getNeighbors() {
        const result = [];

        if (this.walls[WALL_TOP] === false) {
            const above = this.grid.cellAbove(this);
            if (above) {
                result.push(above);
            }
        }

        if (this.walls[WALL_RIGHT] === false) {
            const right = this.grid.cellToRight(this);
            if (right) {
                result.push(right);
            }
        }

        if (this.walls[WALL_BOTTOM] === false) {
            const below = this.grid.cellBelow(this);
            if (below) {
                result.push(below);
            }
        }

        if (this.walls[WALL_LEFT] === false) {
            const left = this.grid.cellToLeft(this);
            if (left) {
                result.push(left);
            }
        }

        return result;
    }

    carveUp() {
        this.walls[WALL_TOP] = false;
    }

    carveRight() {
        this.walls[WALL_RIGHT] = false;
    }

    carveDown() {
        this.walls[WALL_BOTTOM] = false;
    }

    carveLeft() {
        this.walls[WALL_LEFT] = false;
    }

    /**
     *
     * @param {Cell} other
     */
    carveTo(other) {
        if (other.col > this.col) {
            this.carveRight();
            other.carveLeft();
        } else if (other.col < this.col) {
            this.carveLeft();
            other.carveRight();
        } else if (other.row > this.row) {
            this.carveDown();
            other.carveUp();
        } else if (other.row < this.row) {
            this.carveUp();
            other.carveDown();
        }
    }

    /**
     * @param {boolean} v
     * @memberof Cell
     */
    visit(v) {
        this.visited = v;
    }

    /**
     * @returns {{r: number,c: number}}
     */
    coords() {
        return { r: this.row, c: this.col };
    }

    /**
     * @returns {{x: number,y: number}}
     */
    xy() {
        return { x: this.cellmarginleft + this.col * this.cellsize, y: this.cellmargintop + this.row * this.cellsize };
    }

    /**
     * @returns {{x: number,y: number}}
     */
    center() {
        const { x, y } = this.xy();
        return { x: x + this.cellsize / 2, y: y + this.cellsize / 2 };
    }

    /**
     * @param {Color} color
     */
    higlight(color) {
        const { x, y } = this.xy();
        this.p.push();
        this.p.noStroke();
        this.p.fill(color);
        this.p.rect(x + 1, y + 1, this.cellsize - 2, this.cellsize - 2);
        this.p.pop();
    }

    /**
     * @param {Color} _color
     */
    solution(_color) {
        /*
        const { x, y } = this.xy();
        this.p.push();
        this.p.noStroke();
        this.p.fill(_color);
        //this.p.textAlign(this.p.CENTER, this.p.CENTER);
        //this.p.textSize(this.cellsize / 3);
        //this.p.text(this.h, x + this.cellsize / 2, y + this.cellsize / 2);

        this.p.fill(this.p.lerpColor(this.p.color(0,0,255,0),this.p.color(0,0,255,128),this.h / 147));
        this.p.rect(x,y,this.cellsize,this.cellsize)

        this.p.pop();
        */
    }

    // left = \u2190, right = \u2192 up = \u2191 down = \u2193

    /**
     * @param {Color} _color
     */
    stack(_color) {
        const { x, y } = this.xy();
        const { x: x1, y: y1 } = this.center();

        this.p.push();

        // eslint-disable-next-line no-constant-condition
        if (1 === 1) {
            this.p.stroke(0, 0, 0);
            this.p.fill(0, 0, 0);
            this.p.rectMode(this.p.CENTER)
            this.p.rect(x1, y1, 1, 1);
        } else {
            this.p.noStroke();
            this.p.fill(255, 0, 0);
            this.p.textSize(this.cellsize / 2);

            const above = this.grid.cellAbove(this);

            if (above && !above.visited) {
                this.p.textAlign(this.p.CENTER, this.p.BOTTOM);
                this.p.text('\u2191', x + this.cellsize / 2, y + this.cellsize / 2);
            }

            const left = this.grid.cellToLeft(this);

            if (left && !left.visited) {
                this.p.textAlign(this.p.LEFT, this.p.CENTER);
                this.p.text('\u2190', x, y + this.cellsize / 2);
            }

            const right = this.grid.cellToRight(this);

            if (right && !right.visited) {
                this.p.textAlign(this.p.LEFT, this.p.CENTER);
                this.p.text('\u2192', x + this.cellsize / 2, y + this.cellsize / 2);
            }

            const below = this.grid.cellBelow(this);

            if (below && !below.visited) {
                this.p.textAlign(this.p.CENTER, this.p.TOP);
                this.p.text('\u2193', x + this.cellsize / 2, y + this.cellsize / 2);
            }
        }
        this.p.pop();
    }

    /**
     * @param {Color} color
     */
    old_stack(color) {
        const { x, y } = this.xy();

        this.p.push();
        this.p.noStroke();
        this.p.fill(color);
        this.p.circle(x + this.cellsize / 2, y + this.cellsize / 2, this.cellsize / 2);
        this.p.pop();
    }

    drawWalls() {
        if (!this.visited) {
            return;
        }

        const { x, y } = this.xy();
        const cs = this.cellsize;

        this.p.push();

        this.p.stroke(this.borderColor);
        this.p.noFill();

        if (this.walls[WALL_TOP]) {
            this.p.line(x, y, x + cs, y);
        }

        if (this.walls[WALL_RIGHT]) {
            this.p.line(x + cs, y, x + cs, y + cs);
        }

        if (this.walls[WALL_BOTTOM]) {
            this.p.line(x + cs, y + cs, x, y + cs);
        }
        if (this.walls[WALL_LEFT]) {
            this.p.line(x, y + cs, x, y);
        }

        this.p.pop();
    }

    draw() {
        if (!this.visited) {
            return;
        }
        const { x, y } = this.xy();

        this.p.push();

        this.p.stroke(this.visitedColor);
        this.p.fill(this.visitedColor);
        this.p.rect(x, y, this.cellsize, this.cellsize);

        this.p.pop();
    }
}
