const { JSDOM } = require('jsdom');

require('ts-node').register({});

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
copyProps(window, global);
global.Blob = window.Blob;
global.Uint8Array = window.Uint8Array;

module.exports.jsdom = jsdom;