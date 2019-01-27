/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

/**
 * Generic animation class with support for dropped frames both optional easing and duration.
 *
 * Optional duration is useful when the lifetime is defined by another condition than time
 * e.g. speed of an animating object, etc.
 *
 * Dropped frame logic allows to keep using the same updater logic independent from the actual
 * rendering. This eases a lot of cases where it might be pretty complex to break down a state
 * based on the pure time difference.
 */

const time: () => number = Date.now || function () {
  return +new Date();
};


let desiredFrames = 60;
let millisecondsPerSecond = 1000;
let running = {};
let counter = 1;


export class SkAnimate {
  /**
   * A requestAnimationFrame wrapper / polyfill.
   *
   * @param callback Function, The callback to be invoked before the next repaint.
   * @param root HTMLElement The root element for the repaint
   */
  static requestAnimationFrame: (call: () => void) => void = window.requestAnimationFrame || window.webkitRequestAnimationFrame;


  /**
   * Stops the given animation.
   *
   * @param id Unique animation ID
   * @return Whether the animation was stopped (aka, was running before)
   */
  static stop(id: any): boolean {
    let cleared = running[id] != null;
    if (cleared) {
      running[id] = null;
    }
    return cleared;
  }

  /**
   * Whether the given animation is still running.
   *
   * @param id Unique animation ID
   * @return Whether the animation is still running
   */
  static isRunning(id) {
    return running[id] != null;
  }

  /**
   * Start the animation.
   *
   * @param stepCallback Pointer to function which is executed on every step.
   *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
   * @param verifyCallback Executed before every animation step.
   *   Signature of the method should be `function() { return continueWithAnimation; }`
   * @param completedCallback
   *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
   * @param duration Milliseconds to run the animation
   * @param easingMethod  Pointer to easing function
   *   Signature of the method should be `function(percent) { return modifiedValue; }`
   * @param root  Render root, when available. Used for internal
   *   usage of requestAnimationFrame.
   * @return Identifier of animation. Can be used to stop it any time.
   */
  static start(stepCallback: (value: any, now: any, render: any) => any,
        verifyCallback ?: (id: number) => boolean,
        completedCallback ?: (frame: number, id: number, is: boolean) => void,
        duration ?: number,
        easingMethod ?: (percent: number) => number,
        root: Element = document.body): number {

    let start = time();
    let lastFrame = start;
    let percent = 0;
    let dropCounter = 0;
    let id = counter++;

    // Compacting running db automatically every few new animations
    if (id % 20 === 0) {
      let newRunning = {};
      for (let usedId in running) {
        newRunning[usedId] = true;
      }
      running = newRunning;
    }

    // This is the internal step method which is called every few milliseconds
    let step = function (virtual ?: any) {

      // Normalize virtual value
      let render = virtual !== true;

      // Get current time
      let now = time();

      // Verification is executed before next animation step
      if (!running[id] || (verifyCallback && !verifyCallback(id))) {

        running[id] = null;
        if (typeof completedCallback === 'function') {
          completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
        }
        return;

      }

      // For the current rendering to apply let's update omitted steps in memory.
      // This is important to bring internal state variables up-to-date with progress in time.
      if (render) {

        let droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
        for (let j = 0; j < Math.min(droppedFrames, 4); j++) {
          step(true);
          dropCounter++;
        }

      }

      // Compute percent value
      if (duration) {
        percent = (now - start) / duration;
        if (percent > 1) {
          percent = 1;
        }
      }

      // Execute step callback, then...
      let value = easingMethod ? easingMethod(percent) : percent;
      if ((stepCallback(value, now, render) === false || percent === 1) && render) {
        running[id] = null;
        if (typeof completedCallback === 'function') {
          completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration == null);
        }
      } else if (render) {
        lastFrame = now;
        SkAnimate.requestAnimationFrame(step);
      }
    };

    // Mark as running
    running[id] = true;

    // Init first step
    SkAnimate.requestAnimationFrame(step);

    // Return unique animation ID
    return id;
  }
}
