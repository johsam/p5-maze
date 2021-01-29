/**
 * @typedef {import('p5')} P5
 */

/**
 * @param {string} containerId
 * @param {number} modulus
 * @returns {{width: number,height: number}}
 */
const parentSize = (containerId, modulus) => {
    const box = document.getElementById(containerId);
    // @ts-ignore
    let w = box.offsetWidth;
    // @ts-ignore
    let h = box.offsetHeight;

    if (modulus !== 0) {
        w = w - (w % modulus);
        h = h - (h % modulus);
    }

    return { width: w, height: h };
};

/**
 * @param {P5} p
 */
const debug_stats = (p) => {
    p.push();
    p.noStroke()
    p.fill(0,0,0,128);
    p.text(`${p.width}x${p.height} -> ${p.frameRate().toFixed(1)}`,10,15)
    //p.text(`${p.width}x${p.height}`, 10, 15);
    p.pop();
};
/**
 * @param {P5} p
 */
const debug_cross = (p) => {
    p.push();
    p.stroke(0);
    p.scale(0.5);
    p.line(p.width , 0, p.width, p.height);
    p.line(0, p.height, p.width, p.height);
    p.pop();
};

export default {
    parentSize,
    debug_stats,
    debug_cross,
};
