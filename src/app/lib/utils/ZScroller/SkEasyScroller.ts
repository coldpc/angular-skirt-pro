import {InScrollerOptions, SkScroller} from "./SkScroller";

export class SkEasyScroller {

  static vendorPrefix: string;

  container: any;
  content: HTMLDivElement;
  options: InScrollerOptions;
  scroller: SkScroller;

  render: any = initRender();

  reflowBind: () => void;

  constructor(content: HTMLDivElement, options: InScrollerOptions) {

    this.content = content;
    this.container = content.parentNode;
    this.options = options || {};

    // create Scroller instance
    let that = this;
    this.scroller = new SkScroller(function (left, top, zoom) {
      that.render(left, top, zoom);
      if (typeof that.options.onScroll === 'function') {
        that.options.onScroll(left, top, zoom);
      }
    }, options);

    // bind events
    this.bindEvents();

    // the content element needs a correct transform origin for zooming
    this.content.style[SkEasyScroller.vendorPrefix + 'TransformOrigin'] = "left top";

    // reflow for the first time
    this.reflow();
    this.reflowBind = this.reflow.bind(this);
  }

  reflow() {
    // set the right scroller dimensions
    this.scroller.setDimensions(this.container.clientWidth,
      this.container.clientHeight, this.content.offsetWidth, this.content.offsetHeight);

    // refresh the position for zooming purposes
    let rect = this.container.getBoundingClientRect();
    this.scroller.setPosition(rect.left + this.container.clientLeft, rect.top + this.container.clientTop);
  }

  bindEvents() {

    let that = this;

    // reflow handling
    window.addEventListener("resize", function () {
      that.reflow();
    }, false);

    // touch devices bind touch events
    if ('ontouchstart' in window) {

      this.container.addEventListener("touchstart", function (e) {

        // Don't react if initial down happens on a form element
        if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
          return;
        }

        // reflow since the container may have changed
        that.reflow();

        that.scroller.doTouchStart(e.touches, e.timeStamp);
      }, false);

      this.container.addEventListener("touchmove", function (e) {
        e.preventDefault();
        that.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
      }, false);

      this.container.addEventListener("touchend", function (e) {
        that.scroller.doTouchEnd(e.timeStamp);
      }, false);

      this.container.addEventListener("touchcancel", function (e) {
        that.scroller.doTouchEnd(e.timeStamp);
      }, false);

      // non-touch bind mouse events
    } else {

      let mousedown = false;

      this.container.addEventListener("mousedown", function (e) {

        if (e.target.tagName.match(/input|textarea|select/i)) {
          return;
        }

        let touches: Array<any> = [{
          pageX: e.pageX,
          pageY: e.pageY
        }];
        that.scroller.doTouchStart(touches, e.timeStamp);

        mousedown = true;

        // reflow since the container may have changed
        that.reflow();

        e.preventDefault();

      }, false);

      document.addEventListener("mousemove", function (e) {

        if (!mousedown) {
          return;
        }

        let touches: Array<any> = [{
          pageX: e.pageX,
          pageY: e.pageY
        }];
        that.scroller.doTouchMove(touches, e.timeStamp);

        mousedown = true;

      }, false);

      document.addEventListener("mouseup", function (e) {

        if (!mousedown) {
          return;
        }

        that.scroller.doTouchEnd(e.timeStamp);

        mousedown = false;

      }, false);

      this.container.addEventListener("mousewheel", function (e) {
        if (that.options.zooming) {
          that.scroller.doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
          e.preventDefault();
        }
      }, false);

    }
  }
}

// // automatically attach an EasyScroller to elements found with the right data attributes
// document.addEventListener("DOMContentLoaded", function() {
//
// 	let elements = document.querySelectorAll('[data-scrollable],[data-zoomable]'), element;
// 	for (let i = 0; i < elements.length; i++) {
//
// 		element = elements[i];
// 		let scrollable = element.attributes.getNamedItem('data-scrollable') ? element.attributes.getNamedItem('data-scrollable').value : null;
// 		let zoomable = element.attributes.getNamedItem('data-zoomable') ? element.attributes.getNamedItem('data-zoomable').value : '';
// 		let zoomOptions = zoomable.split('-');
// 		let minZoom = zoomOptions.length > 1 && parseFloat(zoomOptions[0]);
// 		let maxZoom = zoomOptions.length > 1 && parseFloat(zoomOptions[1]);
//
// 		new EasyScroller(element, {
// 			scrollingX: scrollable === 'true' || scrollable === 'x',
// 			scrollingY: scrollable === 'true' || scrollable === 'y',
// 			zooming: zoomable === 'true' || zoomOptions.length > 1,
// 			minZoom: minZoom,
// 			maxZoom: maxZoom
// 		});
//
// 	};
//
// }, false);


function initRender() {
  let docStyle = document.documentElement.style;

  let engine;
  if (window['opera'] && Object.prototype.toString.call(window['opera']) === '[object Opera]') {
    engine = 'presto';
  } else if ('MozAppearance' in docStyle) {
    engine = 'gecko';
  } else if ('WebkitAppearance' in docStyle) {
    engine = 'webkit';
  } else if (typeof navigator['cpuClass'] === 'string') {
    engine = 'trident';
  }

  let vendorPrefix = SkEasyScroller.vendorPrefix = {
    trident: 'ms',
    gecko: 'Moz',
    webkit: 'Webkit',
    presto: 'O'
  }[engine];

  let helperElem = document.createElement("div");
  let perspectiveProperty = vendorPrefix + "Perspective";
  let transformProperty = vendorPrefix + "Transform";

  if (helperElem.style[perspectiveProperty] !== undefined) {

    return function (left, top, zoom) {
      this.content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
    };

  } else if (helperElem.style[transformProperty] !== undefined) {

    return function (left, top, zoom) {
      this.content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
      this.content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
    };

  } else {

    return function (left, top, zoom) {
      this.content.style.marginLeft = left ? (-left / zoom) + 'px' : '';
      this.content.style.marginTop = top ? (-top / zoom) + 'px' : '';
      this.content.style.zoom = zoom || '';
    };

  }
}
