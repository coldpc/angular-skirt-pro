import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef
} from '@angular/core';

import {isUndefined} from "util";
import {InPickerSelectedValue} from "../../lib/interfaces/InPickerSelectedValue";
import {DynamicCore} from "../dynamicCore/DynamicCore";

// 默认的valueFiled 和displayFiled
const DEFAULT_VALUE_FIELD = 'value';
const DEFAULT_DISPLAY_FIELD = 'text';

@Component({
  selector: 'sk-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default

})
export class PickerComponent extends DynamicCore {

  // 输入参数
  @Input() displayField: string = DEFAULT_DISPLAY_FIELD;
  @Input() valueField: string = DEFAULT_VALUE_FIELD;
  @Input() data: Array<any>;
  @Input() title: string;

  // 输出参数
  @Output() valueChange: EventEmitter<InPickerSelectedValue> = new EventEmitter();

  private _value;

  // 完成动画事件
  public animateEvent;

  // 内部值
  public innerValue;
  // 是否显示了picker的dom结构
  public isShowPicker: boolean = false;

  constructor() {
    super();
  }

  onAnimateDone(e) {
    this.animateEvent = e;

    let isShow = e.toState === 'active';
    if (isShow !== this.isShowPicker) {
      this.isShowPicker = isShow;
    }

    console.log(this.innerValue);
  }

  onAnimateStart(e) {
    this.animateEvent = e;

    this.isShowPicker = e.toState === 'active';
  }

  onHide() {
    this.isShowChange.emit(false);
  }

  // 重置value
  onShow() {
    this.innerValue = this.value;
  }

  onConfirm() {
    this._value = this.innerValue;
    this.valueChange.emit(this.value);
  }

  @Input()
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      this.innerValue = value;
    }
  }

  get value(): any {
    return this._value;
  }
}
