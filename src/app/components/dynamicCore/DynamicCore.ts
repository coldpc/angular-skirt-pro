import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import has = Reflect.has;


enum EnMaskState {
  hide = 'inactive',
  show = 'active'
}

export class DynamicCore {
  @Output() hideEvent: EventEmitter<EnMaskState> = new EventEmitter<EnMaskState>();
  @Output() showEvent: EventEmitter<EnMaskState> = new EventEmitter<EnMaskState>();

  // 是否显示
  private _isShow: boolean = false;
  state: EnMaskState = EnMaskState.hide;

  @Input()
  set isShow(isShow) {
    if (this.isShow !== isShow) {
      this._isShow = isShow;
      this.setState(isShow);
    }
  }

  get isShow(): boolean {
    return this._isShow;
  }

  @Output() isShowChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // 点击背景是否隐藏
  @Input() isTapBackHide = true;

  private _hasShow: boolean = false;
  get hasShow(): boolean {
    return this._hasShow;
  }
  set hasShow(hasShow: boolean) {
    this._hasShow = hasShow;
  }

  constructor() {
  }

  hide() {
    if (this.isShow) {
      this.isShow = false;
    }
  }

  show() {
    if (!this.isShow) {
      this.isShow = true;
    }
  }

  private setState(isShow: boolean) {
    // 常量 遮罩
    const maskState = isShow ? EnMaskState.show : EnMaskState.hide;
    this.state = maskState;

    if (isShow) {
      this.hasShow = true;
      this.showEvent.emit(maskState);
    } else {
      this.hideEvent.emit(maskState);
    }
    this.isShowChange.emit(isShow);
  }
}
