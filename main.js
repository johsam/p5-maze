/* eslint-disable no-new */
import sketch from './assets/js/sketch.js';
//import p5 from 'p5'

window.addEventListener('DOMContentLoaded', (_event) => {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    new p5(sketch('container',0));
});
