/*jslint browser */

function wrap(n, max) {
  return (n + max) % max;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function isHTMLElement(el) {
  return Boolean(el) &&
    typeof el === "object" &&
    typeof el.nodeType === "number" &&
    el.nodeType === 1 &&
    typeof el.nodeName === "string";
}

function makeGenId() {
  let count = 0;
  function nextId() {
    const id = count;
    count += 1;
    return String(id);
  }
  return nextId;
}

const genId = makeGenId();

export {genId, isHTMLElement, lerp, wrap};