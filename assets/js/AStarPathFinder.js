// @ts-nocheck

export default class AStarPathFinder {
    constructor(p, start, end) {
        this.p = p;
        this.start = start;
        this.end = end;
        this.reset();
    }

    reset() {
        this.lastCheckedNode = this.start;
        this.openSet = [this.start]; // openSet starts with beginning node only
        this.closedSet = [];

        this.solved = false;
        this.status = 0;    
    }


    // An educated guess of how far it is between two points

    heuristic(a, b) {
        return a.manhattanDistanceTo(b);
    }

    getPath() {
        const path = [];
        let temp = this.lastCheckedNode;

        path.push(temp);

        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }
        path.push(temp);

        return path.reverse();
    }

    isSolved() {
        return this.solved;
    }

    //Run one finding step.
    //returns 0 if search ongoing
    //returns 1 if goal reached
    //returns -1 if no solution
    step() {
        if (this.openSet.length > 0) {
            // Best next option
            let winner = 0;

            this.openSet.forEach((idx, candidate) => {
                if (candidate.f < this.openSet[winner].f) {
                    winner = idx;
                }
                //If we have a tie according to the standard heuristic
                if (candidate.f == this.openSet[winner].f) {
                    //Prefer to explore options with longer known paths (closer to goal)
                    if (candidate.g > this.openSet[winner].g) {
                        winner = idx;
                    }
                }
            });

            const current = this.openSet[winner];
            this.lastCheckedNode = current;

            // Did I finish?
            if (current === this.end) {
                this.solved = true;
                this.status = 1;
                console.log('DONE!');
                return 1;
            }

            // Best option moves from openSet to closedSet

            this.openSet = this.openSet.filter((item) => item !== current);
            this.closedSet.push(current);

            // Check all the neighbors
            const neighbors = current.getNeighbors();

            for (const neighbor of neighbors) {
                // Valid next spot?
                if (!this.closedSet.includes(neighbor)) {
                    // Is this a better path than before?
                    const tempG = current.g + this.heuristic(neighbor, current);

                    // Is this a better path than before?
                    if (!this.openSet.includes(neighbor)) {
                        this.openSet.push(neighbor);
                    } else if (tempG >= neighbor.g) {
                        // No, it's not a better path
                        continue;
                    }
                    neighbor.g = tempG;
                    neighbor.h = this.heuristic(neighbor, this.end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }

            this.status = 0;

            return 0;
            // Uh oh, no solution
        } else {
            console.log('no solution');
            this.solved = true;
            this.status = -1;
            return -1;
        }
    }
}
