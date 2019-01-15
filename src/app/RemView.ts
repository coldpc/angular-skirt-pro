declare var window;

// 设计稿的宽度危375
export const DEFAULT_DESIGN_WIDTH = 375;
export const DEFAULT_MAX_FONT_SIZE = 120;

export class RemView {


  // 原来的设备像素比
  static  devicePixelRatio = window.devicePixelRatio || 1;

  designWidth;
  maxFontSize;
  designRatio = 1;
  htmlFontSize = 100;

  constructor(designWidth = DEFAULT_DESIGN_WIDTH, designRatio = 1, maxFontSize = DEFAULT_MAX_FONT_SIZE) {
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
    viewport.setAttribute('content',
      `width=device-width, initial-scale=${1 / SystemConfig.devicePixelRatio}, shrink-to-fit=no, user-scalable=0, viewport-fit=cover`);
  }

  /**
   * 设置html的fontSize
   * 用rem适配不同的机型
   * rem包含缩放
   */
  setHtmlFontSize() {
    const {maxFontSize, designWidth, designRatio} = this;
    const html = window.document.documentElement;
    const screenWidth = window.Math.min(window.screen.availWidth, window.screen.availHeight);

    let fontSize = 100 * screenWidth / designWidth;
    if (fontSize > maxFontSize) {
      fontSize = maxFontSize;
    }

    fontSize = window.Math.floor(fontSize * SystemConfig.devicePixelRatio / designRatio);
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
