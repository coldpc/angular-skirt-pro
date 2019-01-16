import { Component, OnInit, Input, Output } from '@angular/core';
import {UtilsBase} from "../../lib/utils/UtilsBase";

enum EnInputClass {
  disabled = 'disabled',
  none = ''
}

// 设备像素比
const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;

// 设计样式
const DESIGN_STYLE = {
  paddingTop: 0.18,
  paddingLeft: 0.12,
  fontSize: 0.15
};

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
  disabledClass: EnInputClass = EnInputClass.none;
  deviceTypeClass = '';

  // input 内部样式
  // 由于屏幕进行过缩放 在android手机光标变小 为了放大 需要做些处理
  // 暂时不处理了
  inputStyle: {
    fontSize ?: any,
    width ?: any,
    padding ?: any,
    lineHeight ?: any,
    height ?: any,
    transform ?: any
  } = {};

  ratio: any;

  constructor() { }

  ngOnInit() {
    this.setInputStyle(UtilsBase.getClient().isAndroid ? DEVICE_PIXEL_RATIO : 1);
  }

  // 由于缩放导致光标变小
  // 暂时写死当作两倍屏幕来处理
  setInputStyle(ratio) {
    this.ratio = ratio;
    let inputStyle = this.inputStyle;
    inputStyle.padding = `${DESIGN_STYLE.paddingTop / ratio}rem 0`;
    inputStyle.transform = `scale(${ratio})`;
    inputStyle.width = `${100 / ratio}%`;
    inputStyle.height = inputStyle.fontSize = `${DESIGN_STYLE.fontSize / ratio}rem`;
  }
}
