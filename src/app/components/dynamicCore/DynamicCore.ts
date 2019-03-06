import {Input, Output, EventEmitter} from '@angular/core';


enum EnMaskState {
  hide = 'inactive',
  show = 'active'
}

export class DynamicCore {
  @Output() hideEvent: EventEmitter<EnMaskState> = new EventEmitter<EnMaskState>();
  @Output() showEvent: EventEmitter<EnMaskState> = new EventEmitter<EnMaskState>();
  @Output() isShowChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // 是否显示
  private _isShow: boolean = false;

  // 是否已经显示过 用于标记if很重要
  private _hasShow: boolean = false;

  // 状态标记动画
  public state: EnMaskState = EnMaskState.hide;

  get hasShow(): boolean {
    return this._hasShow;
  }

  @Input()
  set isShow(isShow) {
    if (this.isShow !== isShow) {
      this._isShow = isShow;
      this.setState(isShow);

      // 显示过 就设置这个值
      if (isShow) {
        this._hasShow = true;
      }
    }
  }

  get isShow(): boolean {
    return this._isShow;
  }

  hide() {
    if (this._isShow) {
      this._isShow = false;
      this.setState(false, true);
    }
  }

  show() {
    if (!this._isShow) {
      this._isShow = true;
      this.setState(true, true);
    }
  }

  private setState(isShow: boolean, isAsync = false) {
    // 常量 遮罩
    const maskState = isShow ? EnMaskState.show : EnMaskState.hide;
    this.state = maskState;

    // 同步isShow的值
    this.isShowChange.emit(isShow);


    if (isShow) {
      this.showEvent.emit(maskState);
    } else {
      this.hideEvent.emit(maskState);
    }
  }
}
