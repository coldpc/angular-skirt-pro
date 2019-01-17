import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


enum EnMaskState {
  hide = 'inactive',
  show = 'active'
}

@Component({
  selector: 'sk-mask',
  templateUrl: './mask.component.html',
  styleUrls: ['./mask.component.scss'],
  animations: [
    trigger('ctrlMask', [
      state('active', style({
        opacity: 1,
      })),
      state('inactive', style({
        opacity: 0.1,
        display: "none"
      })),
      transition('* <=> *', animate('200ms ease-out'))
    ])
  ]
})
export class MaskComponent implements OnInit {
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

  constructor() {
  }

  ngOnInit() {
  }

  private onTap(): void {
    if (this.isTapBackHide) {
      this.hide();
    }
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
      this.showEvent.emit(maskState);
    } else {
      this.hideEvent.emit(maskState);
    }
    this.isShowChange.emit(isShow);
  }

  private onTouchMove(event: TouchEvent): void {
    event.stopPropagation();

    if (event.cancelable) {
      event.preventDefault();
    }
  }
}
