/*jslint browser, for, this */

import {vec2} from "./vector2.js";
import {raf}from "./raf-loop.js";

function tilt(node, options) {
  let resolved = resolveOptions(node, options);
  let trigger = resolved.trigger;
  let target = resolved.target;
  let lerpAmount = 0.06;
  const rotDeg = {current: vec2(), target: vec2()};
  const bgPos = {current: vec2(), target: vec2()};
  let rafId;

  function ticker(obj) {
    rafId = obj.id;
    rotDeg.current.lerp(rotDeg.target, lerpAmount);
    bgPos.current.lerp(bgPos.target, lerpAmount);
    target.forEach(function (el) {
      el.style.setProperty("--rotX", rotDeg.current.y.toFixed(2) + "deg");
      el.style.setProperty("--rotY", rotDeg.current.x.toFixed(2) + "deg");
      el.style.setProperty("--bgPosX", bgPos.current.x.toFixed(2) + "%");
      el.style.setProperty("--bgPosY", bgPos.current.y.toFixed(2) + "%");
    });
  }

  function onMouseMove(e) {
    lerpAmount = 0.1;
    target.forEach(function (el) {
      const ox = (e.offsetX - el.clientWidth * 0.5) / (Math.PI * 3);
      const oy = -(e.offsetY - el.clientHeight * 0.5) / (Math.PI * 4);
      rotDeg.target.set(ox, oy);
      bgPos.target.set(-ox * 0.3, oy * 0.3);
    });
  }

  function onMouseLeave() {
    lerpAmount = 0.06;
    rotDeg.target.set(0, 0);
    bgPos.target.set(0, 0);
  }

  function addListeners() {
    trigger.addEventListener("mousemove", onMouseMove);
    trigger.addEventListener("mouseleave", onMouseLeave);
  }

  function removeListeners() {
    trigger.removeEventListener("mousemove", onMouseMove);
    trigger.removeEventListener("mouseleave", onMouseLeave);
  }

  function init() {
    addListeners();
    raf.add(ticker);
  }

  function destroy() {
    removeListeners();
    raf.remove(rafId);
  }

  function update(newOptions) {
    destroy();
    resolved = resolveOptions(node, newOptions);
    trigger = resolved.trigger;
    target = resolved.target;
    init();
  }

  init();

  return Object.freeze({
    destroy,
    update
  });
}

function resolveOptions(node, options) {
  let triggerNode = node;
  let targetNodes;
  if (options && options.trigger) {
    triggerNode = options.trigger;
  }
  if (options && options.target) {
    if (Array.isArray(options.target)) {
      targetNodes = options.target;
    } else {
      targetNodes = [options.target];
    }
  } else {
    targetNodes = [node];
  }
  return {
    target: targetNodes,
    trigger: triggerNode
  };
}

export {tilt};