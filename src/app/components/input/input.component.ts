import { Component, OnInit, Input, Output } from '@angular/core';

enum EnInputClass {
  disabled = 'disabled',
  none = ''
}

// 设备像素比
const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;

@Component({
  selector: 'sk-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  // 输入类型
  @Input() type: string = 'text'; // text number

  @Input()
  set disabled(isDisabled: boolean) {
    this._disabled = isDisabled;
    this.disabledClass = isDisabled ? EnInputClass.disabled : EnInputClass.none;
  }

  get disabled() {
    return this._disabled;
  }

  private _disabled: boolean = false;

  // 禁用class
  disabledClass: EnInputClass;

  // input 内部样式
  // 由于屏幕进行过缩放 在android手机光标变小 为了放大 需要做些处理
  inputStyle = {
    scale: '',
  };

  constructor() { }

  ngOnInit() {

  }


}
