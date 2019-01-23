import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';

import {isUndefined} from "util";
import {UtilsBase} from "../../lib/utils/UtilsBase";

// 默认的valueFiled 和displayFiled
const DEFAULT_VALUE_FIELD = 'value';
const DEFAULT_DISPLAY_FIELD = 'text';

const REM = parseInt(UtilsBase.getStyle(document.documentElement).fontSize, 10);
const MAX_EXCEED = 30;
const VISIBLE_RANGE = 100;
const DEFAULT_ITEM_HEIGHT = Math.ceil(REM * 0.4); // 每一项的高度
const BLUR_WIDTH = 10;
const ITEM_RATIO = 0.9;

const platform = navigator.platform.toLowerCase();
const userAgent = navigator.userAgent.toLowerCase();
const HIGH_LIGHT = "high-light";
const VISIBLE = "visible";
const isIos = (userAgent.indexOf('iphone') > -1 ||
  userAgent.indexOf('ipad') > -1 ||
  userAgent.indexOf('ipod') > -1) &&
  (platform.indexOf('iphone') > -1 ||
    platform.indexOf('ipad') > -1 ||
    platform.indexOf('ipod') > -1);

interface MoveCalc {
  lastAngle: number;
  startAngle: number;
  startY: number;
  isPicking: boolean;
  lastMoveTime: number;
  lastMoveStart: number;
  stopInertiaMove: boolean;
}

interface ListStyle {
  webkitTransformOrigin?: string;
  webkitTransform?: string;
}

interface LiSheet {
  css: any;
  className: string;
  angle: number;
}

export interface PickerValue {
  value?: any;
  item?: any;
}

@Component({
  selector: 'sk-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss']
})
export class PickerComponent implements OnChanges {

  @ViewChild("pickerWrapper") pickerWrapper: ElementRef;
  @ViewChild("listRef") listRef: ElementRef;
  @ViewChild("pickerConRef") pickerConRef: ElementRef;
  @ViewChildren("listItemsRef") listItemsRef: QueryList<ElementRef>;

  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  @Input() value: string;
  @Input() title: string;
  @Input() displayField: string;
  @Input() valueField: string;
  @Input() list: Array<any>;

  holder: any;
  height: number;
  r: number;
  d: number;
  itemHeight: number;
  itemAngle: number;
  highLightRange: number;
  visibleRange: number;
  beginAngle: number;
  endAngle: number;
  beginExceed: number;
  endExceed: number;
  lastIndex: number;
  listRefAngle: number;
  listData: Array<any>;
  itemAngleSheet: Array<LiSheet> = []; // 记录角度数
  result: any;

  listBaseStyle: ListStyle;

  lastValue: any;


  moveCalc: MoveCalc = {
    startAngle: 0,
    lastAngle: 0,
    startY: 0,
    isPicking: false,
    lastMoveTime: 0,
    lastMoveStart: 0,
    stopInertiaMove: false
  };

  static compareTwoValue(v1, v2) {
    if (v1 !== v2) {
      if (typeof v1 === 'number') {
        v1 = v1.toString();
      }

      if (typeof v2 === 'number') {
        v2 = v2.toString();
      }
    }
    return v1 === v2;
  }

  static getDisplay(item, displayField: string = DEFAULT_DISPLAY_FIELD): any {
    if (typeof item === "object") {
      return item[displayField];
    } else {
      return item;
    }
  }

  constructor() {
    let _this = this;
    _this.height = REM * 2;
    _this.r = _this.height / 2 - BLUR_WIDTH;

    if (isIos) {
      _this.listBaseStyle = {
        webkitTransformOrigin: "center center " + _this.r + "px"
      };
    } else {
      _this.listBaseStyle = {};
    }
    _this.d = _this.r * 2;
    _this.itemHeight = DEFAULT_ITEM_HEIGHT;
    _this.itemAngle = parseInt(_this.calcAngle(_this.itemHeight * ITEM_RATIO).toString(), 10);
    _this.highLightRange = _this.itemAngle / 2;
    _this.visibleRange = VISIBLE_RANGE;
    _this.beginAngle = 0;
    _this.beginExceed = _this.beginAngle - MAX_EXCEED;
    _this.listRefAngle = _this.beginAngle;
    _this.endExceed = _this.endAngle + MAX_EXCEED;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.list) {
      this.setData(changes.list.currentValue);
    }
    if (changes.value && !changes.value.firstChange) {
      if (!PickerComponent.compareTwoValue(changes.value.previousValue, changes.value.currentValue)) {
        this.setSelectedValue(changes.value.currentValue);
      }
    }
  }

  rad2deg(rad: number): number {
    return rad / (Math.PI / 180);
  }

  getItemValue(item: any): any {
    if (typeof item === "object") {
      let valueFiled = this.valueField || DEFAULT_VALUE_FIELD;
      return item[valueFiled];
    } else {
      return item;
    }
  }

  getItemDisplay(item: any): any {
    return PickerComponent.getDisplay(item, this.displayField);
  }

  // 查找选项
  getElementItems() {
    let result: Array<any> = [];
    let listItemsRef: QueryList<ElementRef> = this.listItemsRef;
    listItemsRef.forEach(ref => {
      result.push(ref.nativeElement);
    });
    return result;
  }

  getListElement(): any {
    return this.listRef.nativeElement;
  }

  getLiSheet(angle): LiSheet {
    return {
      css: this.getLiStyle(angle),
      className: this.getLiClass(angle),
      angle: angle
    };
  }

  getLiStyle(angle): any {
    let _this = this;
    let transform = "translateZ(" + _this.r + "px) rotateX(" + (-1 * angle) + "deg)";
    let origin = "center center -" + _this.r + "px";
    return {
      webkitTransformOrigin: origin,
      webkitTransform: transform
    };
  }

  getLiClass(angle, beginAngle: any = this.listRefAngle): any {
    let _this = this;
    let difference = Math.abs(angle - beginAngle);
    let classList: string;
    if (difference < _this.highLightRange) {
      classList = HIGH_LIGHT + " " + VISIBLE;
    } else if (difference < _this.visibleRange) {
      classList = VISIBLE;
    } else {
      classList = "";
    }
    return classList;
  }

  getListStyle(): any {
    let style = this.listBaseStyle;
    style.webkitTransform = "perspective(1000px) rotateY(0deg) rotateX(" + this.listRefAngle + "deg)";
    return style;

  }

  calcAngle(c) {
    let _this = this, a, b;

    a = b = parseFloat(_this.r.toString());

    // 直径的整倍数部分直接乘以 180
    // 只算角度不关心正否值
    c = Math.abs(c);

    let intDeg = parseInt((c / _this.d).toString(), 10) * 180;
    c = c % _this.d;

    // 余弦
    let cosC = (a * a + b * b - c * c) / (2 * a * b);
    return intDeg + _this.rad2deg(Math.acos(cosC));
  }

  setAngle(angle) {
    this.listRefAngle = angle;
    this.itemAngleSheet.forEach((item) => {
      item.className = this.getLiClass(item.angle);
    });
  }

  onTouchStart(event) {
    let _this = this;
    let moveCalc = this.moveCalc;
    moveCalc.isPicking = true;
    event.preventDefault();
    _this.getListElement().style.webkitTransition = '';
    moveCalc.startY = (event.changedTouches ? event.changedTouches[0] : event).pageY;
    moveCalc.lastAngle = _this.listRefAngle;
    _this.updateInertiaParams(event, true);
  }

  onTouchEnd(event) {
    let moveCalc = this.moveCalc;
    moveCalc.isPicking = false;
    event.preventDefault();
    this.startInertiaScroll(event);
  }

  onTouchCancel(event) {
    this.moveCalc.isPicking = false;
    event.preventDefault();
    this.startInertiaScroll(event);
  }

  onTouchMove(event) {
    if (!this.moveCalc.isPicking) {
      return;
    }
    event.preventDefault();

    let _this = this;
    let endY = event.targetTouches[0].pageY;
    let dragRange = endY - this.moveCalc.startY;
    let dragAngle = _this.calcAngle(dragRange);
    let newAngle = dragRange > 0 ? this.moveCalc.lastAngle - dragAngle : this.moveCalc.lastAngle + dragAngle;
    if (newAngle > _this.endExceed) {
      newAngle = _this.endExceed;
    }
    if (newAngle < _this.beginExceed) {
      newAngle = _this.beginExceed;
    }
    _this.setAngle(newAngle);
    _this.updateInertiaParams(event, false);
  }

  onTapList(event) {
    let elementItem = event.target;
    let _this = this;
    if (elementItem.tagName.toLowerCase() === 'li') {
      _this.setSelectedIndex(_this.getElementItems().indexOf(elementItem));
    }
  }

  initInertiaParams() {
    let moveCalc = this.moveCalc;
    moveCalc.lastMoveTime = 0;
    moveCalc.lastMoveStart = 0;
    moveCalc.stopInertiaMove = false;
  }

  updateInertiaParams(event, isStart) {
    let _this = this;
    let moveCalc = this.moveCalc;
    let point = event.touches[0];
    if (isStart) {
      moveCalc.lastMoveStart = point.pageY;
      moveCalc.lastMoveTime = event.timeStamp || Date.now();
      moveCalc.startAngle = _this.listRefAngle;
    } else {
      let nowTime = event.timeStamp || Date.now();
      if (nowTime - moveCalc.lastMoveTime > 300) {
        moveCalc.lastMoveTime = nowTime;
        moveCalc.lastMoveStart = point.pageY;
      }
    }
    moveCalc.stopInertiaMove = true;
  }

  startInertiaScroll(event) {
    let _this = this;
    let moveCalc = this.moveCalc;
    let point = event.changedTouches ? event.changedTouches[0] : event;
    /**
     * 缓动代码
     */
    let nowTime = event.timeStamp || Date.now();

    // 最后一段时间手指划动速度
    let v = (point.pageY - moveCalc.lastMoveStart) / (nowTime - moveCalc.lastMoveTime);
    let dir = v > 0 ? -1 : 1; // 加速度方向
    let deceleration = dir * 0.0006 * -1;
    let duration = Math.abs(v / deceleration); // 速度消减至0所需时间
    let dist = v * duration / 2; // 最终移动多少
    let startAngle = _this.listRefAngle;
    let distAngle = _this.calcAngle(dist) * dir;

    // ----
    let srcDistAngle = distAngle;
    if (startAngle + distAngle < _this.beginExceed) {
      distAngle = _this.beginExceed - startAngle;
      duration = duration * (distAngle / srcDistAngle) * 0.6;
    }
    if (startAngle + distAngle > _this.endExceed) {
      distAngle = _this.endExceed - startAngle;
      duration = duration * (distAngle / srcDistAngle) * 0.6;
    }

    // ----
    if (distAngle === 0) {
      _this.endScroll();
      return;
    }
    _this.scrollDistAngle(nowTime, startAngle, distAngle, duration);
  }

  scrollDistAngle(nowTime, startAngle, distAngle, duration) {
    let _this = this;
    let moveCalc = this.moveCalc;
    let frameInterval = 13;
    let stepCount = duration / frameInterval;
    let stepIndex = 0;

    moveCalc.stopInertiaMove = false;
    nowTime = null;

    function inertiaMove() {
      if (moveCalc.stopInertiaMove) {
        return;
      }
      let newAngle = _this.quartEaseOut(stepIndex, startAngle, distAngle, stepCount);
      _this.setAngle(newAngle);
      stepIndex++;

      if (stepIndex > stepCount - 1 || newAngle < _this.beginExceed || newAngle > _this.endExceed) {
        _this.endScroll();
        return;
      }
      setTimeout(inertiaMove, frameInterval);
    }

    inertiaMove();
  }

  quartEaseOut(t, b, c, d): number {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  }

  endScroll() {
    let _this = this;
    if (_this.listRefAngle < _this.beginAngle) {
      _this.getListElement().style.webkitTransition = "30ms ease-out";
      _this.setAngle(_this.beginAngle);
    } else if (_this.listRefAngle > _this.endAngle) {
      _this.getListElement().style.webkitTransition = "30ms ease-out";
      _this.setAngle(_this.endAngle);
    } else {
      let index = parseInt((_this.listRefAngle / _this.itemAngle).toFixed(0), 10);
      _this.getListElement().style.webkitTransition = "30ms ease-out";
      _this.setAngle(_this.itemAngle * index);
    }
    _this.triggerChange();
  }

  triggerChange() {
    let _this = this;
    let index = _this.getSelectedIndex();
    let item = _this.listData[index];
    if (this.getSelectedValue() !== _this.lastValue) {
      _this.change.emit({
        value: _this.getItemValue(item),
        item: item
      });
      _this.lastValue = this.getSelectedValue();
    }
    _this.lastIndex = index;
  }

  correctAngle(angle) {
    let _this = this;
    if (angle < _this.beginAngle) {
      return _this.beginAngle;
    } else if (angle > _this.endAngle) {
      return _this.endAngle;
    } else {
      return angle;
    }
  }

  setData(list: Array<any> = []) {
    this.lastValue = this.getSelectedValue();
    let _this = this;
    _this.listData = list;

    let array: Array<LiSheet> = [];
    let l = list.length;
    for (let i = 0; i < l; i++) {
      array.push(this.getLiSheet(this.itemAngle * i));
    }
    _this.itemAngleSheet = array;
    _this.setAngleConfig();
    _this.setSelectedValue(_this.value);

    if (!this.lastValue) {
      this.lastValue = this.getSelectedValue();
    }
  }

  setAngleConfig() {
    let _this = this, last = _this.itemAngleSheet.length - 1;
    _this.endAngle = last > 0 ? _this.itemAngleSheet[last].angle : 0;
    _this.endExceed = _this.endAngle + MAX_EXCEED;
  }

  getItems() {
    return this.listData;
  }

  getSelectedIndex() {
    let _this = this;
    return parseInt((_this.listRefAngle / _this.itemAngle).toFixed(0), 10);
  }

  setSelectedIndex(index) {
    let _this = this;
    _this.setAngle(_this.getListAngleByIndex(index));
    _this.triggerChange();
  }

  getListAngleByIndex(index: number): number {
    let _this = this;
    return _this.correctAngle(_this.itemAngle * index);
  }

  getSelectedItem() {
    return (this.listData || [])[this.getSelectedIndex()];
  }

  getSelectedValue() {
    let _this = this;
    return _this.getItemValue(_this.getSelectedItem());
  }

  getSelectedText() {
    let _this = this;
    return _this.getItemDisplay(_this.getSelectedItem());
  }

  setSelectedValue(value: string) {
    let _this = this;
    let items = _this.listData || [];
    let index = 0;

    for (let i = 0; i < items.length; i++) {
      if (PickerComponent.compareTwoValue(this.getItemValue(items[i]), value)) {
        index = i;
        break;
      }
    }
    _this.setSelectedIndex(index);
  }
}
