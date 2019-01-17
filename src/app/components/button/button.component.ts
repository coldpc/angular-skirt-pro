import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {EnButtonType, EnButtonSize} from "../../lib/enums/Button";
import {EnDeviceAdaptiveType} from "../../lib/enums/EnDeviceAdaptiveType";

enum EnButtonEffectClass {
  hover = 'hover',
  disabled = 'disabled',
  none = ''

}

@Component({
  selector: 'sk-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Output() tapEvent: EventEmitter<TouchEvent> = new EventEmitter();
  // 是否适配设备 例如：iphoneX
  @Input() adaptType: EnDeviceAdaptiveType = EnDeviceAdaptiveType.none;

  // 按钮的样式
  @Input() buttonStyle: any = {};

  // 按钮的颜色
  @Input() type: EnButtonType = EnButtonType.default;

  // 按钮的尺寸
  @Input() size: EnButtonSize = EnButtonSize.default;

  // 内部效果class
  innerClass: EnButtonEffectClass = EnButtonEffectClass.none;

  // 禁用样式
  disabledClass: EnButtonEffectClass = EnButtonEffectClass.none;

  private _disabled: boolean = false;
  @Input()
  set disabled(isDisabled: boolean) {
    this._disabled = isDisabled;
    this.disabledClass = isDisabled ? EnButtonEffectClass.disabled : EnButtonEffectClass.none;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  constructor() { }

  ngOnInit() {
  }

  // 设置hover的样式
  onHover() {
    this.innerClass = EnButtonEffectClass.hover;
  }

  // 取消hover的样式
  onEnd() {
    this.innerClass = EnButtonEffectClass.none;
  }

  // tap触发的事件
  onTapButton($event) {
    if (!this.disabled) {
      this.tapEvent.emit($event);
    }
  }
}
