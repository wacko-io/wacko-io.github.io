/*jslint browser, this */
/*global requestAnimationFrame, cancelAnimationFrame */

import {genId} from "./math-utils.js";

function Raf() {
  const self = this;
  self.rafId = 0;
  self.callbacks = [];

  function loop() {
    self.callbacks.forEach(function (item) {
      item.callback({id: item.id});
    });
    self.rafId = requestAnimationFrame(loop);
  }

  self.start = function () {
    loop();
  };

  self.stop = function () {
    cancelAnimationFrame(self.rafId);
  };

  self.add = function (callback, id) {
    const identifier = id || genId();
    const item = {};
    item.callback = callback;
    item.id = identifier;
    self.callbacks.push(item);
  };

  self.remove = function (id) {
    self.callbacks = self.callbacks.filter(function (item) {
      return item.id !== id;
    });
  };

  // автозапуск цикла
  self.start();
}

const raf = new Raf();

export {Raf, raf};