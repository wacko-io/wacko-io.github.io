/*jslint browser */

import {lerp}from "./math-utils.js";

function Vec2(x, y) {
  const self = this;
  self.x = x || 0;
  self.y = y || 0;

  self.set = function (nx, ny) {
    self.x = nx;
    self.y = ny;
  };

  self.lerp = function (v, t) {
    self.x = lerp(self.x, v.x, t);
    self.y = lerp(self.y, v.y, t);
  };
}

function vec2(x, y) {
  return new Vec2(x, y);
}

export {Vec2, vec2};