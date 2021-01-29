/* eslint-disable no-param-reassign */

import sketchUtils from './sketchUtils.js';
import Maze from './Maze.js';
/**
 * @export
 * @param {string} containerId
 * @param {number} modulus
 * @returns {function(import('./sketchUtils.js').P5)}
 */

export default function sketch(containerId, modulus = 100) {
    return function (p) {
        // Standard p5 stuff here

        const margins = 15;
        const cellsize = 6;

        /** @type {Maze} */
        let maze;
        let doubleBuffer;

        const action = () => {
            if (!maze.generated()) {
                while (!maze.generated()) {
                    maze.genStep();
                }
                return;
            }

            if (!maze.astar.isSolved()) {
                while (!maze.astar.isSolved()) {
                    maze.astar.step();
                }
                return;
            }

            maze.reset();
            p.loop();
        };

        p.windowResized = () => {
            const { width, height } = sketchUtils.parentSize(containerId, modulus);
            p.resizeCanvas(width, height);
        };

        p.mouseReleased = () => {
            action();
        };

        p.touchEnded = () => {
            //action();
        };

        p.keyReleased = () => {};
        p.preload = () => {};

        p.setup = () => {
            const { width, height } = sketchUtils.parentSize(containerId, modulus);
            const canvas = p.createCanvas(width, height, p.P2D);
            canvas.parent(containerId);

            const ch = Math.floor(p.height / 2);
            const cw = Math.floor(p.width / 2);

            const rows = Math.floor((ch - 2 * margins) / cellsize);
            const cols = Math.floor((cw - 2 * margins) / cellsize);

            const cellmarginleft = (cw - cols * cellsize) / 2;
            const cellmargintop = (ch - rows * cellsize) / 2;

            maze = new Maze(p, rows, cols, { cellmarginleft, cellmargintop, cellsize });

            doubleBuffer = p.createGraphics(width, height);

            //p.randomSeed(4);
            //p.strokeCap(p.ROUND);

            //p.frameRate(10);
            //p.noLoop();
        };

        p.draw = () => {
            p.scale(2);
            p.fill(255);
            p.rect(0, 0, p.width, p.height);
            //p.background(255);

            //sketchUtils.debug_cross(p);

            maze.genStep();

            if (!maze.copied) {
                maze.draw();
            }

            if (maze.generated()) {
                //p.frameRate(5);

                if (!maze.copied) {
                    maze.copied = true;
                    const img = p.get(0, 0, p.width, p.height);
                    doubleBuffer.image(img, 0, 0);
                }

                p.push();
                p.scale(0.5);
                p.image(doubleBuffer, 0, 0);
                p.pop();

                const status = maze.astar.step();
                switch (status) {
                    case 0:
                        break;
                    case 1:
                        p.noLoop();
                        break;
                    case -1:
                        p.noLoop();
                        break;
                }
                maze.drawAstarPath();
            }

            p.push();
            p.scale(0.5);
            sketchUtils.debug_stats(p);
            p.pop();
        };
    };
}
