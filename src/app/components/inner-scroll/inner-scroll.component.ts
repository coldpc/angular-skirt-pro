import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UtilsBase} from "../../lib/utils/UtilsBase";

export const RE_TRANSLATE_MATRIX = /matrix(3d)?\((.+?)\)/;

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface TouchData {
  x0: number;
  y0: number;
  xt: number;
  yt: number;

  direct: number; // 方向
  isTop: boolean; // 是否在顶部
  isBottom: boolean; // 是否在底部
  isStart: boolean; // 是否开始滚动
  isTouch: boolean; // 是否在触摸
  isDrag: boolean; // 是否可以拖拽
}

export interface AutoScrollData {
  y0: number;
  yt: number; // 滚动y
  lastTime: number;
  nowTime: number;
  speed: Array<number>;
}

@Component({
  selector: 'sk-inner-scroll',
  templateUrl: './inner-scroll.component.html',
  styleUrls: ['./inner-scroll.component.scss']
})
export class InnerScrollComponent implements OnInit, AfterViewInit {
  @ViewChild("scrollWrapper") scrollWrapper: ElementRef;
  @ViewChild("scrollContent") scrollContent: ElementRef;

  // 顶部的dom 下拉刷新下拉显示的效果
  @ViewChild("top") topElementRef: ElementRef;
  @ViewChild("bottom") bottomElementRef: ElementRef;

  // 最大的下拉距离
  @Input() maxPullDownDistance = 100 * (window.devicePixelRatio || 1);

  // 最大上拉的距离
  @Input() maxPullUpDistance = 100 * (window.devicePixelRatio || 1);

  // 下拉达到的距离触发刷新
  @Input() pullRefreshDistance = 70 * (window.devicePixelRatio || 1);
  // 是否为下拉刷新
  @Input() isPullRefresh = false;

  // 注容器样式
  @Input() isHideTeamText: any; // 是否隐藏团队标记的字符
  @Input() containerStyle: any;
  @Input() wrapperStyle: any;
  @Input() contentStyle: any;

  @Output() scrollEvent: EventEmitter<InnerScrollComponent> = new EventEmitter();
  @Output() refreshEvent: EventEmitter<InnerScrollComponent> = new EventEmitter();

  // 是否再刷新中
  isRefreshing = false;
  requestFrameSign: number;

  // 孔值下拉刷新的角度
  private _refreshDeg = 0;
  private _refreshTranslateY = -100;
  private _refreshScale = 0.8;



  private _touchData: TouchData = {
    x0: 0,
    y0: 0,
    xt: 0,
    yt: 0,
    direct: 0,
    isTop: false,
    isBottom: false,
    isStart: false,
    isTouch: false,
    isDrag: false
  };

  private _autoScrollData: AutoScrollData = {
    y0: 0,
    yt: 0,
    nowTime: 0,
    lastTime: 0,
    speed: []
  };

  private _isLock = false; // 是否锁定整个操作

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * 设置body的滚动条可展现
   * 设置滚动重置
   */
  ngAfterViewInit() {
    this.init();
  }

  init() {
    let wrapper = this.scrollWrapper.nativeElement;
    let eventName = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      cancel: 'touchcancel',
      scroll: 'scroll'
    };

    // 触摸开始
    wrapper.addEventListener(eventName.start, (e) => {
      this.onTouchStart(e);
    });

    wrapper.addEventListener(eventName.move, (e) => {
      this.onTouchMove(e);
    });


    wrapper.addEventListener(eventName.end, () => {
      this.onTouchEnd();
    });


    wrapper.addEventListener(eventName.cancel, () => {
      this.onTouchEnd();
    });

    wrapper.addEventListener(eventName.scroll, () => {
      // ios 不需要滚动缓冲 暂时去除 因为在iphonex上会闪屏
      // if (CLIENT_INFO.system.name === 'ios') {
      //     this.checkOverScroll();
      // }

      // 触发滚动事件
      this.triggerScroll();
    });
  }

  onTouchStart(e) {
    let touchData = this._touchData;
    let touches = e.targetTouches;
    touchData.y0 = touchData.yt = touches[0].clientY;
    touchData.x0 = touchData.xt = touches[0].clientX;
    touchData.direct = 0;
    touchData.isStart = true;
  }

  /**
   *
   * @param e touch事件
   * 追踪touch
   * 判断方向
   *
   */
  onTouchMove(e) {
    let touches = e.targetTouches;
    let touchData = this._touchData;

    touchData.y0 = touchData.yt;
    touchData.yt = touches[0].clientY;

    touchData.x0 = touchData.xt;
    touchData.xt = touches[0].clientX;


    if (Math.abs(touchData.xt - touchData.x0) > Math.abs(touchData.yt - touchData.y0)) {
      return;
    }

    if (touchData.yt > touchData.y0) {
      touchData.direct = 1;
    } else if (touchData.yt < touchData.y0) {
      touchData.direct = -1;
    } else {
      touchData.direct = 0;
    }

    if (touchData.isDrag && !this._isLock) {
      this.stop(e);
      this.drag();
    } else {
      touchData.isBottom = this.isBottom(touchData.direct);
      touchData.isTop = this.isTop(touchData.direct);

      if (touchData.isBottom || touchData.isTop) {
        this.stop(e);
        if (touchData.isStart) {
          touchData.isDrag = true;
        }
      }
    }

    touchData.isStart = false;
  }

  // 在结局滑动之后做的操作
  onTouchEnd() {
    let touchData = this._touchData;

    if (touchData.isDrag && !this._isLock) {
      this.back();
    }

    touchData.y0 = touchData.yt = 0;
    touchData.direct = 0;
    touchData.isTop = false;
    touchData.isBottom = false;
    touchData.isTouch = false;
    touchData.isDrag = false;

    this._autoScrollData = {
      y0: 0,
      yt: 0,
      lastTime: 0,
      nowTime: 0,
      speed: []
    };
  }

  // 判断滚动条是否在顶部
  isTop(direct): boolean {
    return this.getScrollTop() === 0 && direct === 1;
  }

  // 判断滚动条是否在底部
  isBottom(direct): boolean {
    let scrollTop = this.getScrollTop();
    let pageHeight = this.scrollWrapper.nativeElement.offsetHeight;
    let totalHeight = this.scrollContent.nativeElement.offsetHeight;
    // console.log(direct, pageHeight, totalHeight);
    return direct === -1 && totalHeight - 2 < pageHeight + scrollTop;
  }

  // 获取滚动条滚动的位置
  getScrollTop(): number {
    return this.scrollWrapper.nativeElement.scrollTop || 0;
  }

  // 最大的滚动距离
  getMaxScrollTop(): number {
    let pageHeight = this.scrollWrapper.nativeElement.offsetHeight;
    let totalHeight = this.scrollContent.nativeElement.offsetHeight;
    let max = totalHeight - pageHeight;

    if (max < 0) {
      max = 1;
    }
    return max;
  }

  // 阻止浏览器默认行为
  stop(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }

  // 设置滚动的位置
  setScrollTop(top) {
    console.log('setScrollTop');
    this.scrollWrapper.nativeElement.scrollTop = top;
  }

  // 拖拽
  drag() {
    let touchData = this._touchData;
    let dy = touchData.yt - touchData.y0;
    let transform = this.parseTranslateMatrix(this.scrollWrapper.nativeElement);

    let isTop = touchData.isTop;
    dy = dy * ( 1 - (Math.abs(transform.y) / this.maxPullDownDistance)) * 0.8 + touchData.direct * 0.1;

    let y = transform.y + dy;

    if (isTop) {
      if (y < 0) {
        y = 0;
      } else if ( y > this.maxPullDownDistance) {
        y = this.maxPullDownDistance;
      }

      if (this.isPullRefresh) {
        // 根据下拉的距离设置 旋转和平移和缩放
        let temp = y / this.pullRefreshDistance;
        this.setRefreshDeg(temp * 180);
        this.setRefreshTranslate((1 - temp) * -100);
        this.setRefreshScale(temp);
      }

    } else {
      if (y > 0) {
        y = 0;
      } else if (Math.abs(y) > this.maxPullUpDistance) {
        y = -this.maxPullUpDistance;
      }
    }

    this.setTransitionTime(0);
    this.setTranslate(y);
  }

  /*
   * 这个函数至关重要
   * 解决ios回弹滚动画面闪现的问题
   * 由于ios的回弹，导致scrollTop超出滚动范围 {0, maxScroll}
   * 局部滚动会引起画面重置到滚动范围
   * 这个解决方案将发布与github
   */
  checkOverScroll() {
    let scrollTop = this.getScrollTop();
    if (scrollTop < 0) {
      this.setScrollTop(0);
    } else {
      let maxScrollTop = this.getMaxScrollTop();
      if (maxScrollTop < scrollTop) {
        this.setScrollTop(maxScrollTop);
      }
    }
  }

  // transform 的xyz
  parseTranslateMatrix(dom): Position {
    let style = UtilsBase.getStyle(dom);
    let matrix: Array<string> = style['webkitTransform'].match(RE_TRANSLATE_MATRIX);
    let is3D = matrix && matrix[1];

    if (matrix) {
      matrix = matrix[2].split(",");

      if (is3D === "3d") {
        matrix = matrix.slice(12, 15);
      } else {
        matrix.push('0');
        matrix = matrix.slice(4, 7);
      }

    } else {
      matrix = ['0', '0', '0'];
    }

    return {
      x: parseFloat(matrix[0]),
      y: parseFloat(matrix[1]),
      z: parseFloat(matrix[2])
    };
  }

  /**
   *
   * @param diff 距离
   * 设置translate
   */
  setTranslate(diff: number) {
    let elementStyle = this.scrollWrapper.nativeElement.style;
    elementStyle.webkitTransform = 'translate3d(0,' + diff + 'px,0)';
    elementStyle.transform = 'translate3d(0,' + diff + 'px,0)';
  }

  /**
   * 设置时间
   * @param time 渐变时间
   */
  setTransitionTime(time: number) {
    let elementStyle = this.scrollWrapper.nativeElement.style;
    elementStyle.webkitTransitionDuration = time + 'ms';
    elementStyle.transitionDuration = time + 'ms';
  }

  // 停止移动
  stopTransitionMove() {
    let matrix = this.parseTranslateMatrix(this.scrollContent.nativeElement);
    this.setTransitionTime(0);
    this.setTranslate(matrix.y);
  }

  // 回弹
  back() {
    let y = 0;
    let touchData = this._touchData;
    let matrix = this.parseTranslateMatrix(this.scrollWrapper.nativeElement);
    if (!this.isRefreshing && this.isPullRefresh && touchData.isTop && Math.abs(matrix.y) >  this.pullRefreshDistance) {
      y = this.topElementRef.nativeElement.offsetHeight;
      this.triggerPullRefresh();
    } else {
      this.resetRefreshPara();
    }

    this.setTransitionTime(500);
    this.setTranslate(y);
  }

  // 触发下拉刷新
  triggerPullRefresh() {
    this._isLock = true;
    this.isRefreshing = true;
    this.refreshEvent.emit(this);
    this.rotateAnimal();
  }

  // 结束刷新状态
  endPullRefresh() {
    this.back();
    this.resetRefreshPara();
  }

  // 触发滚动事件
  triggerScroll() {
    this.scrollEvent.emit(this);
  }

  // 重置刷新参数
  resetRefreshPara() {
    this._isLock = false;
    this.isRefreshing = false;
    this._refreshDeg = 0;
    this._refreshTranslateY = -100;
    this._refreshScale = 0.8;
  }

  rotateAnimal() {
    this.requestFrameSign = requestAnimationFrame(() => {
      this.setRefreshDeg(this._refreshDeg + 5);
      if (this.isRefreshing) {
        this.rotateAnimal();
      }
    });
  }

  // 设置下拉刷新的角度
  setRefreshDeg(deg) {
    deg = Math.ceil(deg);
    deg %= 360;
    this._refreshDeg = deg;
  }

  // 设置下拉刷新的平移
  setRefreshTranslate(translateY) {
    if (translateY > 0) {
      translateY = 0;
    }
    this._refreshTranslateY = translateY;
  }

  // 设置下拉刷新的缩放
  setRefreshScale(scale) {
    if (scale > 1) {
      scale = 1.1;
    } else if (scale < 0.8) {
      scale = 0.8;
    }
    this._refreshScale = scale;
  }

  // 获取刷新的整个容器的位置 下拉的效果
  getRefreshContainerTransform() {
    return {};
  }

  // 控制刷新中旋转的效果
  getRefreshCircleTransform() {
    let styleString = 'rotateZ(' + this._refreshDeg + 'deg)';
    return {
      webkitTransform: styleString,
      transform: styleString
    };
  }

}

