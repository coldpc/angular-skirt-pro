import {UtilsBase} from "./lib/utils/UtilsBase";

declare var window;

// 设计稿的宽度危375
const DEFAULT_DESIGN_WIDTH = 375;
const DEFAULT_MAX_FONT_SIZE = 120;

// 设备像素比
const devicePixelRatio = window.devicePixelRatio || 1;

export class RemView {
  static scale = devicePixelRatio;

  static _install;

  designWidth;
  maxFontSize;
  designRatio = 1;
  htmlFontSize = 100;

  /**
   * 初始化设置
   * @param designWidth 设计稿的宽度
   * @param designRatio 设计的比例
   * @param maxFontSize 最大的字体
   */
  static init(designWidth: number = DEFAULT_DESIGN_WIDTH, designRatio: number = 1, maxFontSize: number = DEFAULT_MAX_FONT_SIZE) {
    RemView._install = new RemView(designWidth, designRatio, maxFontSize);
  }

  constructor(designWidth, designRatio, maxFontSize) {
    this.stopPageMenu();

    this.designWidth = designWidth;
    this.maxFontSize = maxFontSize;
    this.designRatio = designRatio;

    this.setViewPort();

    this.setHtmlFontSize();

    window.addEventListener('resize', () => {
      this.setHtmlFontSize();
    });
  }

  // 禁用长按系统菜单 配置一些css
  stopPageMenu() {
    window.document.oncontextmenu = function(e) {
      e.preventDefault();
    };
  }

  /**
   * 设置缩放比例
   * 1px获得1px
   */
  setViewPort() {
    const viewport = window.document.querySelector("meta[name=viewport]");
    const scale = this.getScale(1, devicePixelRatio);

    viewport.setAttribute('content',
      [`width=device-width`,
        `initial-scale=${scale}`,
        `maximum-scale=${scale}`,
        `minimum-scale=${scale}`,
        `shrink-to-fit=no`,
        `user-scalable=0`,
        `viewport-fit=cover`].join(", "));
  }

  getScale(x, y) {
    return Math.round(100 * x / y) / 100;
  }

  /**
   * 设置html的fontSize
   * 用rem适配不同的机型
   * rem包含缩放
   */
  setHtmlFontSize() {
    const client = UtilsBase.getClient();
    const {designWidth, designRatio} = this;
    const html = window.document.documentElement;
    const screenWidth = client.width;

    let fontSize = 100 * screenWidth / designWidth;
    let maxFontSize = this.maxFontSize * devicePixelRatio;

    if (fontSize > maxFontSize) {
      fontSize = maxFontSize;
    }

    fontSize = window.Math.floor(fontSize);
    html.style.fontSize = fontSize + "px";
    this.htmlFontSize = fontSize;
  }

  stopIosScale() {
    // 阻止双击放大
    let lastTouchEnd = 0;
    document.addEventListener('touchstart', function(event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    });
    document.addEventListener('touchend', function(event) {
      let now = (new window.Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // 阻止双指放大
    document.addEventListener('gesturestart', function(event) {
      event.preventDefault();
    });
  }
}
