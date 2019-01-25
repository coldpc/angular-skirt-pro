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

import {TsAnimate} from "./TsAnimate";

export interface InScrollerOptions {
  /** Enable scrolling on x-axis */
  scrollingX?: boolean;

  /** Enable scrolling on y-axis */
  scrollingY?: boolean;

  /** Enable animations for deceleration, snap back, zooming and scrolling */
  animating?: boolean;

  /** duration for animations triggered by scrollTo/zoomTo */
  animationDuration?: number;

  /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
  bouncing?: boolean;

  /** Enable locking to the main axis if user moves only slightly on one of them at start */
  locking?: boolean;

  /** Enable pagination mode (switching between full page content panes) */
  paging?: boolean;

  /** Enable snapping of content to a configured pixel grid */
  snapping?: boolean;

  /** Enable zooming of content via API, fingers and mouse wheel */
  zooming?: boolean;

  /** Minimum zoom level */
  minZoom?: number;

  /** Maximum zoom level */
  maxZoom?: number;

  /** Multiply or decrease scrolling speed **/
  speedMultiplier?: number;

  /** Callback that is fired on the later of touch end or deceleration end,
   provided that another scrolling action has not begun. Used to know
   when to fade out a scrollbar. */
  scrollingComplete?: () => void;

  /** This configures the amount of change applied to deceleration when reaching boundaries  **/
  penetrationDeceleration?: number;

  /** This configures the amount of change applied to acceleration when reaching boundaries  **/
  penetrationAcceleration?: number;
}

function NOOP() {
}


// Easing Equations (c) 2003 Robert Penner, all rights reserved.
// Open source under the BSD License.

/**
 * @param pos position between 0 (start of effect) and 1 (end of effect)
 **/
function easeOutCubic(pos: number) {
  return (Math.pow((pos - 1), 3) + 1);
}

/**
 * @param pos  position between 0 (start of effect) and 1 (end of effect)
 **/
function easeInOutCubic(pos: number) {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 3);
  }

  return 0.5 * (Math.pow((pos - 2), 3) + 2);
}

/**
 * A pure logic 'component' for 'virtual' scrolling/zooming.
 */

export class TsScroller {
  private __callback: any;
  public options: InScrollerOptions;

  constructor(callback, options: InScrollerOptions) {
    this.__callback = callback;

    this.options = {

      /** Enable scrolling on x-axis */
      scrollingX: true,

      /** Enable scrolling on y-axis */
      scrollingY: true,

      /** Enable animations for deceleration, snap back, zooming and scrolling */
      animating: true,

      /** duration for animations triggered by scrollTo/zoomTo */
      animationDuration: 250,

      /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
      bouncing: true,

      /** Enable locking to the main axis if user moves only slightly on one of them at start */
      locking: true,

      /** Enable pagination mode (switching between full page content panes) */
      paging: false,

      /** Enable snapping of content to a configured pixel grid */
      snapping: false,

      /** Enable zooming of content via API, fingers and mouse wheel */
      zooming: false,

      /** Minimum zoom level */
      minZoom: 0.5,

      /** Maximum zoom level */
      maxZoom: 3,

      /** Multiply or decrease scrolling speed **/
      speedMultiplier: 1,

      /** Callback that is fired on the later of touch end or deceleration end,
       provided that another scrolling action has not begun. Used to know
       when to fade out a scrollbar. */
      scrollingComplete: NOOP,

      /** This configures the amount of change applied to deceleration when reaching boundaries  **/
      penetrationDeceleration: 0.03,

      /** This configures the amount of change applied to acceleration when reaching boundaries  **/
      penetrationAcceleration: 0.08
    };

    for (let key in options) {
      this.options[key] = options[key];
    }
  }


  /*
      ---------------------------------------------------------------------------
          INTERNAL FIELDS :: STATUS
      ---------------------------------------------------------------------------
      */

  /** p{Boolean} Whether only a single finger is used in touch handling */
  __isSingleTouch = false;

  /** p{Boolean} Whether a touch event sequence is in progress */
  __isTracking = false;

  /** p{Boolean} Whether a deceleration animation went to completion. */
  __didDecelerationComplete = false;

  /**
   * p{Boolean} Whether a gesture zoom/rotate event is in progress. Activates when
   * a gesturestart event happens. This has higher priority than dragging.
   */
  __isGesturing = false;

  /**
   * p{Boolean} Whether the user has moved by such a distance that we have enabled
   * dragging mode. Hint = It's only enabled after some pixels of movement to
   * not interrupt with clicks etc.
   */
  __isDragging = false;

  /**
   * p{Boolean} Not touching and dragging anymore, and smoothly animating the
   * touch sequence using deceleration.
   */
  __isDecelerating: number = NaN;

  /**
   * p{Boolean} Smoothly animating the currently configured change
   */
  __isAnimating = false;
  __animatingId: number;

  __initialTouchLeft: number;
  __initialTouchTop: number;

  // Store current zoom level
  __zoomLevelStart: number;

  __lastScale = 1;

  // Reset locking flags
  __enableScrollX: boolean;
  __enableScrollY: boolean;


  /*
      ---------------------------------------------------------------------------
          INTERNAL FIELDS : = DIMENSIONS
      ---------------------------------------------------------------------------
      */

  /** {Integer} Available outer left position (from document perspective) */
  __clientLeft = 0;

  /** {Integer} Available outer top position (from document perspective) */
  __clientTop = 0;

  /** {Integer} Available outer width */
  __clientWidth = 0;

  /** {Integer} Available outer height */
  __clientHeight = 0;

  /** {Integer} Outer width of content */
  __contentWidth = 0;

  /** {Integer} Outer height of content */
  __contentHeight = 0;

  /** {Integer} Snapping width for content */
  __snapWidth = 100;

  /** {Integer} Snapping height for content */
  __snapHeight = 100;

  /** {Integer} Height to assign to refresh area */
  __refreshHeight = null;

  /** p{Boolean} Whether the refresh process is enabled when the event is released now */
  __refreshActive = false;

  /** {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release */
  __refreshActivate = null;

  /** {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled */
  __refreshDeactivate = null;

  /** {Function} Callback to execute to start the actual refresh. Call {@link #refreshFinish} when done */
  __refreshStart = null;

  /** p{Number} Zoom level */
  __zoomLevel = 1;

  /** p{Number} Scroll position on x-axis */
  __scrollLeft = 0;

  /** p{Number} Scroll position on y-axis */
  __scrollTop = 0;

  /** {Integer} Maximum allowed scroll position on x-axis */
  __maxScrollLeft = 0;

  /** {Integer} Maximum allowed scroll position on y-axis */
  __maxScrollTop = 0;

  /* p{Number} Scheduled left position (final position when animating) */
  __scheduledLeft = 0;

  /* p{Number} Scheduled top position (final position when animating) */
  __scheduledTop = 0;

  /* p{Number} Scheduled zoom level (final scale when animating) */
  __scheduledZoom = 0;


  /*
      ---------------------------------------------------------------------------
          INTERNAL FIELDS :: LAST POSITIONS
      ---------------------------------------------------------------------------
      */

  /** p{Number} Left position of finger at start */
  __lastTouchLeft = null;

  /** p{Number} Top position of finger at start */
  __lastTouchTop = null;

  /** {Date} Timestamp of last move of finger. Used to limit tracking range for deceleration speed. */
  __lastTouchMove = null;

  /** {Array} List of positions; uses three indexes for each state = left; top; timestamp */
  __positions = null;


  /*
      ---------------------------------------------------------------------------
          INTERNAL FIELDS :: DECELERATION SUPPORT
      ---------------------------------------------------------------------------
      */

  /** {Integer} Minimum left scroll position during deceleration */
  __minDecelerationScrollLeft = null;

  /** {Integer} Minimum top scroll position during deceleration */
  __minDecelerationScrollTop = null;

  /** {Integer} Maximum left scroll position during deceleration */
  __maxDecelerationScrollLeft = null;

  /** {Integer} Maximum top scroll position during deceleration */
  __maxDecelerationScrollTop = null;

  /** p{Number} Current factor to modify horizontal scroll position with on every step */
  __decelerationVelocityX = null;

  /** p{Number} Current factor to modify vertical scroll position with on every step */
  __decelerationVelocityY = null;

  __zoomComplete: Function;

  // interruptedAnimation flag
  __interruptedAnimation = false;

  /*
      ---------------------------------------------------------------------------
          PUBLIC API
      ---------------------------------------------------------------------------
      */

  /**
   * Configures the dimensions of the client (outer) and content (inner) elements.
   * Requires the available space for the outer element and the outer size of the inner element.
   * All values which are falsy (null or zero etc.) are ignored and the old value is kept.
   *
   * @param clientWidth   Inner width of outer element
   * @param clientHeight   Inner height of outer element
   * @param contentWidth   Outer width of inner element
   * @param contentHeight   Outer height of inner element
   */
  setDimensions(clientWidth ?: number, clientHeight ?: number, contentWidth ?: number, contentHeight ?: number) {

    let _self = this;

    // Only update values which are defined
    if (clientWidth === +clientWidth) {
      _self.__clientWidth = clientWidth;
    }

    if (clientHeight === +clientHeight) {
      _self.__clientHeight = clientHeight;
    }

    if (contentWidth === +contentWidth) {
      _self.__contentWidth = contentWidth;
    }

    if (contentHeight === +contentHeight) {
      _self.__contentHeight = contentHeight;
    }

    // Refresh maximums
    _self.__computeScrollMax();

    // Refresh scroll position
    _self.scrollTo(_self.__scrollLeft, _self.__scrollTop, true);

  }


  /**
   * Sets the client coordinates in relation to the document.
   *
   * @param left   Left position of outer element
   * @param top   Top position of outer element
   */
  setPosition(left: number, top: number) {

    let _self = this;

    _self.__clientLeft = left || 0;
    _self.__clientTop = top || 0;
  }


  /**
   * Configures the snapping (when snapping is active)
   *
   * @param width Snapping width
   * @param height p{Integer} Snapping height
   */
  setSnapSize(width: number, height: number) {
    this.__snapWidth = width;
    this.__snapHeight = height;
  }


  /**
   * Activates pull-to-refresh. A special zone on the top of the list to start a list refresh whenever
   * the user event is released during visibility of this zone. This was introduced by some apps on iOS like
   * the official Twitter client.
   *
   * @param height p{Integer} Height of pull-to-refresh zone on top of rendered list
   * @param activateCallback p{Function} Callback to execute on activation.
   * This is for signalling the user about a refresh is about to happen when he release.
   * @param deactivateCallback p{Function} Callback to execute on deactivation.
   * This is for signalling the user about the refresh being cancelled.
   * @param startCallback p{Function} Callback to execute to start the real async refresh action.
   * Call {@link #finishPullToRefresh} after finish of refresh.
   */
  activatePullToRefresh(height: number,
                        activateCallback: () => void,
                        deactivateCallback: () => void,
                        startCallback: () => void) {

    let _self = this;
    _self.__refreshHeight = height;
    _self.__refreshActivate = activateCallback;
    _self.__refreshDeactivate = deactivateCallback;
    _self.__refreshStart = startCallback;
  }


  /**
   * Starts pull-to-refresh manually.
   */
  triggerPullToRefresh() {
    // Use publish instead of scrollTo to allow scrolling to out of boundary position
    // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
    this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, true);

    if (this.__refreshStart) {
      this.__refreshStart();
    }
  }


  /**
   * Signalizes that pull-to-refresh is finished.
   */
  finishPullToRefresh(): void {
    this.__refreshActive = false;
    if (this.__refreshDeactivate) {
      this.__refreshDeactivate();
    }
    this.scrollTo(this.__scrollLeft, this.__scrollTop, true);
  }


  /**
   * Returns the scroll position and zooming values
   *
   * @return p{Map} `left` and `top` scroll position and `zoom` level
   */
  getValues(): { left: number, top: number, zoom: number } {
    return {
      left: this.__scrollLeft,
      top: this.__scrollTop,
      zoom: this.__zoomLevel
    };
  }


  /**
   * Returns the maximum scroll values
   *
   * @return p{Map} `left` and `top` maximum scroll values
   */
  getScrollMax(): { left: number, top: number } {
    return {
      left: this.__maxScrollLeft,
      top: this.__maxScrollTop
    };
  }


  /**
   * Zooms to the given level. Supports optional animation. Zooms
   * the center when no coordinates are given.
   *
   * @param level pp{Number} Level to zoom to
   * @param animate p{Boolean ? false} Whether to use animation
   * @param originLeft p{Number ? null} Zoom in at given left coordinate
   * @param originTop p{Number ? null} Zoom in at given top coordinate
   * @param callback p{Function ? null} A callback that gets fired when the zoom is complete.
   */
  zoomTo(level: number,
         animate: boolean,
         originLeft: number,
         originTop: number,
         callback ?: () => void) {

    let _self = this;

    if (!_self.options.zooming) {
      throw new Error("Zooming is not enabled!");
    }

    // Add callback if exists
    if (callback) {
      _self.__zoomComplete = callback;
    }

    // Stop deceleration
    if (!isNaN(_self.__isDecelerating)) {
      TsAnimate.stop(_self.__isDecelerating);
      _self.__isDecelerating = NaN;
    }

    let oldLevel = _self.__zoomLevel;

    // Normalize input origin to center of viewport if not defined
    if (originLeft == null) {
      originLeft = _self.__clientWidth / 2;
    }

    if (originTop == null) {
      originTop = _self.__clientHeight / 2;
    }

    // Limit level according to configuration
    level = Math.max(Math.min(level, _self.options.maxZoom), _self.options.minZoom);

    // Recompute maximum values while temporary tweaking maximum scroll ranges
    _self.__computeScrollMax(level);

    // Recompute left and top coordinates based on new zoom level
    let left = ((originLeft + _self.__scrollLeft) * level / oldLevel) - originLeft;
    let top = ((originTop + _self.__scrollTop) * level / oldLevel) - originTop;

    // Limit x-axis
    if (left > _self.__maxScrollLeft) {
      left = _self.__maxScrollLeft;
    } else if (left < 0) {
      left = 0;
    }

    // Limit y-axis
    if (top > _self.__maxScrollTop) {
      top = _self.__maxScrollTop;
    } else if (top < 0) {
      top = 0;
    }

    // Push values out
    _self.__publish(left, top, level, animate);
  }


  /**
   * Zooms the content by the given factor.
   *
   * @param factor p{Number} Zoom by given factor
   * @param animate p{Boolean ? false} Whether to use animation
   * @param originLeft p{Number ? 0} Zoom in at given left coordinate
   * @param originTop p{Number ? 0} Zoom in at given top coordinate
   * @param callback p{Function ? null} A callback that gets fired when the zoom is complete.
   */
  zoomBy(factor, animate, originLeft, originTop, callback) {
    let _self = this;
    _self.zoomTo(_self.__zoomLevel * factor, animate, originLeft, originTop, callback);

  }


  /**
   * Scrolls to the given position. Respect limitations and snapping automatically.
   *
   * @param left p{Number?null} Horizontal scroll position, keeps current if value is <code>null</code>
   * @param top p{Number?null} Vertical scroll position, keeps current if value is <code>null</code>
   * @param animate p{Boolean?false} Whether the scrolling should happen using an animation
   * @param zoom p{Number?null} Zoom level to go to
   */
  scrollTo(left ?: number, top ?: number, animate ?: boolean, zoom ?: number) {

    let _self = this;

    // Stop deceleration
    if (!isNaN(_self.__isDecelerating)) {
      TsAnimate.stop(_self.__isDecelerating);
      _self.__isDecelerating = NaN;
    }

    // Correct coordinates based on new zoom level
    if (zoom != null && zoom !== _self.__zoomLevel) {

      if (!_self.options.zooming) {
        throw new Error("Zooming is not enabled!");
      }

      left *= zoom;
      top *= zoom;

      // Recompute maximum values while temporary tweaking maximum scroll ranges
      _self.__computeScrollMax(zoom);

    } else {

      // Keep zoom when not defined
      zoom = _self.__zoomLevel;

    }

    if (!_self.options.scrollingX) {

      left = _self.__scrollLeft;

    } else {

      if (_self.options.paging) {
        left = Math.round(left / _self.__clientWidth) * _self.__clientWidth;
      } else if (_self.options.snapping) {
        left = Math.round(left / _self.__snapWidth) * _self.__snapWidth;
      }

    }

    if (!_self.options.scrollingY) {

      top = _self.__scrollTop;

    } else {

      if (_self.options.paging) {
        top = Math.round(top / _self.__clientHeight) * _self.__clientHeight;
      } else if (_self.options.snapping) {
        top = Math.round(top / _self.__snapHeight) * _self.__snapHeight;
      }

    }

    // Limit for allowed ranges
    left = Math.max(Math.min(_self.__maxScrollLeft, left), 0);
    top = Math.max(Math.min(_self.__maxScrollTop, top), 0);

    // Don't animate when no change detected, still call publish to make sure
    // that rendered position is really in-sync with internal data
    if (left === _self.__scrollLeft && top === _self.__scrollTop) {
      animate = false;
    }

    // Publish new values
    _self.__publish(left, top, zoom, animate);
    // if (!_self.__isTracking) {
    //   _self.__publish(left, top, zoom, animate);
    // }

  }

  /**
   * Scroll by the given offset
   *
   * @param left p{Number ? 0} Scroll x-axis by given offset
   * @param top p{Number ? 0} Scroll x-axis by given offset
   * @param animate p{Boolean ? false} Whether to animate the given change
   */
  scrollBy(left: number, top: number, animate: boolean) {

    let _self = this;

    let startLeft = _self.__isAnimating ? _self.__scheduledLeft : _self.__scrollLeft;
    let startTop = _self.__isAnimating ? _self.__scheduledTop : _self.__scrollTop;

    _self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);

  }

  /*
      ---------------------------------------------------------------------------
          EVENT CALLBACKS
      ---------------------------------------------------------------------------
      */

  /**
   * Mouse wheel handler for zooming support
   */
  doMouseZoom(wheelDelta: number, timeStamp: number, pageX: number, pageY: number) {

    let _self = this;
    let change = wheelDelta > 0 ? 0.97 : 1.03;

    return _self.zoomTo(_self.__zoomLevel * change,
      false,
      pageX - _self.__clientLeft,
      pageY - _self.__clientTop);
  }

  /**
   * Touch start handler for scrolling support
   */
  doTouchStart(touches: Touch[], timeStamp: number|Date) {

    // Array-like check is enough here
    if (touches.length == null) {
      throw new Error("Invalid touch list: " + touches);
    }

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      throw new Error("Invalid timestamp value: " + timeStamp);
    }

    let _self = this;

    // Reset interruptedAnimation flag
    _self.__interruptedAnimation = true;

    // Stop deceleration
    if (_self.__isDecelerating) {
      TsAnimate.stop(_self.__isDecelerating);
      _self.__isDecelerating = NaN;
      _self.__interruptedAnimation = true;
    }

    // Stop animation
    if (_self.__isAnimating) {
      TsAnimate.stop(_self.__animatingId);
      _self.__isAnimating = false;
      _self.__interruptedAnimation = true;
      _self.__animatingId = NaN;
    }

    // Use center point when dealing with two fingers
    let currentTouchLeft, currentTouchTop;
    let isSingleTouch = touches.length === 1;
    if (isSingleTouch) {
      currentTouchLeft = touches[0].pageX;
      currentTouchTop = touches[0].pageY;
    } else {
      currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
      currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
    }

    // Store initial positions
    _self.__initialTouchLeft = currentTouchLeft;
    _self.__initialTouchTop = currentTouchTop;

    // Store current zoom level
    _self.__zoomLevelStart = _self.__zoomLevel;

    // Store initial touch positions
    _self.__lastTouchLeft = currentTouchLeft;
    _self.__lastTouchTop = currentTouchTop;

    // Store initial move time stamp
    _self.__lastTouchMove = timeStamp;

    // Reset initial scale
    _self.__lastScale = 1;

    // Reset locking flags
    _self.__enableScrollX = !isSingleTouch && _self.options.scrollingX;
    _self.__enableScrollY = !isSingleTouch && _self.options.scrollingY;

    // Reset tracking flag
    _self.__isTracking = true;

    // Reset deceleration complete flag
    _self.__didDecelerationComplete = false;

    // Dragging starts directly with two fingers, otherwise lazy with an offset
    _self.__isDragging = !isSingleTouch;

    // Some features are disabled in multi touch scenarios
    _self.__isSingleTouch = isSingleTouch;

    // Clearing data structure
    _self.__positions = [];

  }

  /**
   * Touch move handler for scrolling support
   */
  doTouchMove(touches, timeStamp, scale ?: any) {

    // Array-like check is enough here
    if (touches.length == null) {
      throw new Error("Invalid touch list: " + touches);
    }

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      throw new Error("Invalid timestamp value: " + timeStamp);
    }

    let _self = this;

    // Ignore event when tracking is not enabled (event might be outside of element)
    if (!_self.__isTracking) {
      return;
    }


    let currentTouchLeft, currentTouchTop;

    // Compute move based around of center of fingers
    if (touches.length === 2) {
      currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
      currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
    } else {
      currentTouchLeft = touches[0].pageX;
      currentTouchTop = touches[0].pageY;
    }

    let positions = _self.__positions;

    // Are we already is dragging mode?
    if (_self.__isDragging) {

      // Compute move distance
      let moveX = currentTouchLeft - _self.__lastTouchLeft;
      let moveY = currentTouchTop - _self.__lastTouchTop;

      // Read previous scroll position and zooming
      let scrollLeft = _self.__scrollLeft;
      let scrollTop = _self.__scrollTop;
      let level = _self.__zoomLevel;

      // Work with scaling
      if (scale != null && _self.options.zooming) {

        let oldLevel = level;

        // Recompute level based on previous scale and new scale
        level = level / _self.__lastScale * scale;

        // Limit level according to configuration
        level = Math.max(Math.min(level, _self.options.maxZoom), _self.options.minZoom);

        // Only do further compution when change happened
        if (oldLevel !== level) {

          // Compute relative event position to container
          let currentTouchLeftRel = currentTouchLeft - _self.__clientLeft;
          let currentTouchTopRel = currentTouchTop - _self.__clientTop;

          // Recompute left and top coordinates based on new zoom level
          scrollLeft = ((currentTouchLeftRel + scrollLeft) * level / oldLevel) - currentTouchLeftRel;
          scrollTop = ((currentTouchTopRel + scrollTop) * level / oldLevel) - currentTouchTopRel;

          // Recompute max scroll values
          _self.__computeScrollMax(level);

        }
      }

      if (_self.__enableScrollX) {

        scrollLeft -= moveX * this.options.speedMultiplier;
        let maxScrollLeft = _self.__maxScrollLeft;

        if (scrollLeft > maxScrollLeft || scrollLeft < 0) {

          // Slow down on the edges
          if (_self.options.bouncing) {

            scrollLeft += (moveX / 2 * this.options.speedMultiplier);

          } else if (scrollLeft > maxScrollLeft) {

            scrollLeft = maxScrollLeft;

          } else {

            scrollLeft = 0;

          }
        }
      }

      // Compute new vertical scroll position
      if (_self.__enableScrollY) {

        scrollTop -= moveY * this.options.speedMultiplier;
        let maxScrollTop = _self.__maxScrollTop;

        if (scrollTop > maxScrollTop || scrollTop < 0) {

          // Slow down on the edges
          if (_self.options.bouncing) {

            scrollTop += (moveY / 2 * this.options.speedMultiplier);

            // Support pull-to-refresh (only when only y is scrollable)
            if (!_self.__enableScrollX && _self.__refreshHeight != null) {

              if (!_self.__refreshActive && scrollTop <= -_self.__refreshHeight) {

                _self.__refreshActive = true;
                if (_self.__refreshActivate) {
                  _self.__refreshActivate();
                }

              } else if (_self.__refreshActive && scrollTop > -_self.__refreshHeight) {

                _self.__refreshActive = false;
                if (_self.__refreshDeactivate) {
                  _self.__refreshDeactivate();
                }

              }
            }

          } else if (scrollTop > maxScrollTop) {

            scrollTop = maxScrollTop;

          } else {

            scrollTop = 0;

          }
        }
      }

      // Keep list from growing infinitely (holding min 10, max 20 measure points)
      if (positions.length > 60) {
        positions.splice(0, 30);
      }

      // Track scroll movement for decleration
      positions.push(scrollLeft, scrollTop, timeStamp);

      // Sync scroll position
      _self.__publish(scrollLeft, scrollTop, level);

      // Otherwise figure out whether we are switching into dragging mode now.
    } else {

      let minimumTrackingForScroll = _self.options.locking ? 3 : 0;
      let minimumTrackingForDrag = 5;

      let distanceX = Math.abs(currentTouchLeft - _self.__initialTouchLeft);
      let distanceY = Math.abs(currentTouchTop - _self.__initialTouchTop);

      _self.__enableScrollX = _self.options.scrollingX && distanceX >= minimumTrackingForScroll;
      _self.__enableScrollY = _self.options.scrollingY && distanceY >= minimumTrackingForScroll;

      positions.push(_self.__scrollLeft, _self.__scrollTop, timeStamp);

      _self.__isDragging = (_self.__enableScrollX || _self.__enableScrollY)
        && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);

      if (_self.__isDragging) {
        _self.__interruptedAnimation = false;
      }

    }

    // Update last touch positions and time stamp for next event
    _self.__lastTouchLeft = currentTouchLeft;
    _self.__lastTouchTop = currentTouchTop;
    _self.__lastTouchMove = timeStamp;
    _self.__lastScale = scale;

  }

  /**
   * Touch end handler for scrolling support
   */
  doTouchEnd(timeStamp) {

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      throw new Error("Invalid timestamp value: " + timeStamp);
    }

    let _self = this;

    // Ignore event when tracking is not enabled (no touchstart event on element)
    // This is required as this listener ('touchmove') sits on the document and not on the element it_self.
    if (!_self.__isTracking) {
      return;
    }

    // Not touching anymore (when two finger hit the screen there are two touch end events)
    _self.__isTracking = false;

    // Be sure to reset the dragging flag now. Here we also detect whether
    // the finger has moved fast enough to switch into a deceleration animation.
    if (_self.__isDragging) {

      // Reset dragging flag
      _self.__isDragging = false;

      // Start deceleration
      // Verify that the last move detected was in some relevant time frame
      if (_self.__isSingleTouch && _self.options.animating && (timeStamp - _self.__lastTouchMove) <= 100) {

        // Then figure out what the scroll position was about 100ms ago
        let positions = _self.__positions;
        let endPos = positions.length - 1;
        let startPos = endPos;

        // Move pointer to position measured 100ms ago
        for (let i = endPos; i > 0 && positions[i] > (_self.__lastTouchMove - 100); i -= 3) {
          startPos = i;
        }

        // If start and stop position is identical in a 100ms timeframe,
        // we cannot compute any useful deceleration.
        if (startPos !== endPos) {

          // Compute relative movement between these two points
          let timeOffset = positions[endPos] - positions[startPos];
          let movedLeft = _self.__scrollLeft - positions[startPos - 2];
          let movedTop = _self.__scrollTop - positions[startPos - 1];

          // Based on 50ms compute the movement to apply for each render step
          _self.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
          _self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);

          // How much velocity is required to start the deceleration
          let minVelocityToStartDeceleration = _self.options.paging || _self.options.snapping ? 4 : 1;

          // Verify that we have enough velocity to start deceleration
          if (Math.abs(_self.__decelerationVelocityX) > minVelocityToStartDeceleration
            || Math.abs(_self.__decelerationVelocityY) > minVelocityToStartDeceleration) {

            // Deactivate pull-to-refresh when decelerating
            if (!_self.__refreshActive) {
              _self.__startDeceleration(timeStamp);
            }
          } else {
            _self.options.scrollingComplete();
          }
        } else {
          _self.options.scrollingComplete();
        }
      } else if ((timeStamp - _self.__lastTouchMove) > 100) {
        _self.options.scrollingComplete();
      }
    }

    // If this was a slower move it is per default non decelerated, but this
    // still means that we want snap back to the bounds which is done here.
    // This is placed outside the condition above to improve edge case stability
    // e.g. touchend fired without enabled dragging. This should normally do not
    // have modified the scroll positions or even showed the scrollbars though.
    if (!_self.__isDecelerating) {

      if (_self.__refreshActive && _self.__refreshStart) {

        // Use publish instead of scrollTo to allow scrolling to out of boundary position
        // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
        _self.__publish(_self.__scrollLeft, -_self.__refreshHeight, _self.__zoomLevel, true);

        if (_self.__refreshStart) {
          _self.__refreshStart();
        }

      } else {

        if (_self.__interruptedAnimation || _self.__isDragging) {
          _self.options.scrollingComplete();
        }
        _self.scrollTo(_self.__scrollLeft, _self.__scrollTop, true, _self.__zoomLevel);

        // Directly signalize deactivation (nothing todo on refresh?)
        if (_self.__refreshActive) {

          _self.__refreshActive = false;
          if (_self.__refreshDeactivate) {
            _self.__refreshDeactivate();
          }

        }
      }
    }

    // Fully cleanup list
    _self.__positions.length = 0;

  }

  /*
      ---------------------------------------------------------------------------
          PRIVATE API
      ---------------------------------------------------------------------------
      */

  /**
   * Applies the scroll position to the content element
   *
   * @param left p{Number} Left scroll position
   * @param top p{Number} Top scroll position
   * @param animate p{Boolean?false} Whether animation should be used to move to the new coordinates
   */
  __publish(left, top, zoom, animate ?: boolean) {

    let _self = this;

    // Remember whether we had an animation, then we try to continue based on the current "drive" of the animation
    let wasAnimating = _self.__isAnimating;
    if (wasAnimating) {
      TsAnimate.stop(_self.__animatingId);
      _self.__isAnimating = false;
    }

    if (animate && _self.options.animating) {

      // Keep scheduled positions for scrollBy/zoomBy functionality
      _self.__scheduledLeft = left;
      _self.__scheduledTop = top;
      _self.__scheduledZoom = zoom;

      let oldLeft = _self.__scrollLeft;
      let oldTop = _self.__scrollTop;
      let oldZoom = _self.__zoomLevel;

      let diffLeft = left - oldLeft;
      let diffTop = top - oldTop;
      let diffZoom = zoom - oldZoom;

      let step = function (percent, now, render) {

        if (render) {

          _self.__scrollLeft = oldLeft + (diffLeft * percent);
          _self.__scrollTop = oldTop + (diffTop * percent);
          _self.__zoomLevel = oldZoom + (diffZoom * percent);

          // Push values out
          if (_self.__callback) {
            _self.__callback(_self.__scrollLeft, _self.__scrollTop, _self.__zoomLevel);
          }

        }
      };

      let verify = function (id) {
        return _self.__animatingId === id;
      };

      let completed = function (renderedFramesPerSecond, animationId, wasFinished) {
        if (animationId === _self.__animatingId) {
          _self.__isAnimating = false;
          _self.__animatingId = NaN;
        }
        if (_self.__didDecelerationComplete || wasFinished) {
          _self.options.scrollingComplete();
        }

        if (_self.options.zooming) {
          _self.__computeScrollMax();
          if (_self.__zoomComplete) {
            _self.__zoomComplete();
            _self.__zoomComplete = null;
          }
        }
      };

      // When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
      _self.__animatingId = TsAnimate.start(step, verify,
        completed,
        _self.options.animationDuration,
        wasAnimating ? easeOutCubic : easeInOutCubic);
      _self.__isAnimating = true;

    } else {

      _self.__scheduledLeft = _self.__scrollLeft = left;
      _self.__scheduledTop = _self.__scrollTop = top;
      _self.__scheduledZoom = _self.__zoomLevel = zoom;

      // Push values out
      if (_self.__callback) {
        _self.__callback(left, top, zoom);
      }

      // Fix max scroll ranges
      if (_self.options.zooming) {
        _self.__computeScrollMax();
        if (typeof _self.__zoomComplete === 'function') {
          _self.__zoomComplete();
          _self.__zoomComplete = null;
        }
      }
    }
  }


  /**
   * Recomputes scroll minimum values based on client dimensions and content dimensions.
   */
  __computeScrollMax(zoomLevel ?: number): void {

    let _self = this;

    if (zoomLevel == null) {
      zoomLevel = _self.__zoomLevel;
    }

    _self.__maxScrollLeft = Math.max((_self.__contentWidth * zoomLevel) - _self.__clientWidth, 0);
    _self.__maxScrollTop = Math.max((_self.__contentHeight * zoomLevel) - _self.__clientHeight, 0);

  }


  /*
      ---------------------------------------------------------------------------
          ANIMATION (DECELERATION) SUPPORT
      ---------------------------------------------------------------------------
      */

  /**
   * Called when a touch sequence end and the speed of the finger was high enough
   * to switch into deceleration mode.
   */
  __startDeceleration(timeStamp) {

    let _self = this;

    if (_self.options.paging) {

      let scrollLeft = Math.max(Math.min(_self.__scrollLeft, _self.__maxScrollLeft), 0);
      let scrollTop = Math.max(Math.min(_self.__scrollTop, _self.__maxScrollTop), 0);
      let clientWidth = _self.__clientWidth;
      let clientHeight = _self.__clientHeight;

      // We limit deceleration not to the min/max values of the allowed range, but to the size of the visible client area.
      // Each page should have exactly the size of the client area.
      _self.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
      _self.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
      _self.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
      _self.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;

    } else {

      _self.__minDecelerationScrollLeft = 0;
      _self.__minDecelerationScrollTop = 0;
      _self.__maxDecelerationScrollLeft = _self.__maxScrollLeft;
      _self.__maxDecelerationScrollTop = _self.__maxScrollTop;

    }

    // Wrap class method
    let step = function (percent, now, render) {
      _self.__stepThroughDeceleration(render);
    };

    // How much velocity is required to keep the deceleration running
    let minVelocityToKeepDecelerating = _self.options.snapping ? 4 : 0.001;

    // Detect whether it's still worth to continue animating steps
    // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
    let verify = function () {
      let shouldContinue = Math.abs(_self.__decelerationVelocityX) >= minVelocityToKeepDecelerating
        || Math.abs(_self.__decelerationVelocityY) >= minVelocityToKeepDecelerating;
      if (!shouldContinue) {
        _self.__didDecelerationComplete = true;
      }
      return shouldContinue;
    };

    let completed = function (renderedFramesPerSecond, animationId, wasFinished) {
      _self.__isDecelerating = NaN;
      if (_self.__didDecelerationComplete) {
        _self.options.scrollingComplete();
      }

      // Animate to grid when snapping is active, otherwise just fix out-of-boundary positions
      _self.scrollTo(_self.__scrollLeft, _self.__scrollTop, _self.options.snapping);
    };

    // Start animation and switch on flag
    _self.__isDecelerating = TsAnimate.start(step, verify, completed);

  }

  /**
   * Called on every step of the animation
   *
   * @param inMemory p{Boolean?false}
   * Whether to not render the current step,
   * but keep it in memory only. Used internally only!
   */
  __stepThroughDeceleration(render) {

    let _self = this;


    //
    // COMPUTE NEXT SCROLL POSITION
    //

    // Add deceleration to scroll position
    let scrollLeft = _self.__scrollLeft + _self.__decelerationVelocityX;
    let scrollTop = _self.__scrollTop + _self.__decelerationVelocityY;


    //
    // HARD LIMIT SCROLL POSITION FOR NON BOUNCING MODE
    //

    if (!_self.options.bouncing) {

      let scrollLeftFixed = Math.max(Math.min(_self.__maxDecelerationScrollLeft, scrollLeft), _self.__minDecelerationScrollLeft);
      if (scrollLeftFixed !== scrollLeft) {
        scrollLeft = scrollLeftFixed;
        _self.__decelerationVelocityX = 0;
      }

      let scrollTopFixed = Math.max(Math.min(_self.__maxDecelerationScrollTop, scrollTop), _self.__minDecelerationScrollTop);
      if (scrollTopFixed !== scrollTop) {
        scrollTop = scrollTopFixed;
        _self.__decelerationVelocityY = 0;
      }

    }


    //
    // UPDATE SCROLL POSITION
    //

    if (render) {

      _self.__publish(scrollLeft, scrollTop, _self.__zoomLevel);

    } else {

      _self.__scrollLeft = scrollLeft;
      _self.__scrollTop = scrollTop;

    }


    //
    // SLOW DOWN
    //

    // Slow down velocity on every iteration
    if (!_self.options.paging) {

      // This is the factor applied to every iteration of the animation
      // to slow down the process. This should emulate natural behavior where
      // objects slow down when the initiator of the movement is removed
      let frictionFactor = 0.95;

      _self.__decelerationVelocityX *= frictionFactor;
      _self.__decelerationVelocityY *= frictionFactor;

    }


    //
    // BOUNCING SUPPORT
    //

    if (_self.options.bouncing) {

      let scrollOutsideX = 0;
      let scrollOutsideY = 0;

      // This configures the amount of change applied to deceleration/acceleration when reaching boundaries
      let penetrationDeceleration = _self.options.penetrationDeceleration;
      let penetrationAcceleration = _self.options.penetrationAcceleration;

      // Check limits
      if (scrollLeft < _self.__minDecelerationScrollLeft) {
        scrollOutsideX = _self.__minDecelerationScrollLeft - scrollLeft;
      } else if (scrollLeft > _self.__maxDecelerationScrollLeft) {
        scrollOutsideX = _self.__maxDecelerationScrollLeft - scrollLeft;
      }

      if (scrollTop < _self.__minDecelerationScrollTop) {
        scrollOutsideY = _self.__minDecelerationScrollTop - scrollTop;
      } else if (scrollTop > _self.__maxDecelerationScrollTop) {
        scrollOutsideY = _self.__maxDecelerationScrollTop - scrollTop;
      }

      // Slow down until slow enough, then flip back to snap position
      if (scrollOutsideX !== 0) {
        if (scrollOutsideX * _self.__decelerationVelocityX <= 0) {
          _self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
        } else {
          _self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
        }
      }

      if (scrollOutsideY !== 0) {
        if (scrollOutsideY * _self.__decelerationVelocityY <= 0) {
          _self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
        } else {
          _self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
        }
      }
    }
  }
}
