import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewChildren,
  QueryList
} from '@angular/core';

import {isUndefined} from "util";
import {DynamicCore} from "../dynamicCore/DynamicCore";
import {PickerColumnComponent} from "../picker-column/picker-column.component";

// 默认的valueFiled 和displayFiled
const DEFAULT_VALUE_FIELD = 'value';
const DEFAULT_DISPLAY_FIELD = 'text';

@Component({
  selector: 'sk-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default

})
export class PickerComponent extends DynamicCore implements OnInit {

  // 输入参数
  @Input() displayField: string = DEFAULT_DISPLAY_FIELD;
  @Input() valueField: string = DEFAULT_VALUE_FIELD;
  @Input() title: string;

  // 如果是多列请设置为true
  @Input() isMulti: boolean = false;

  // 这个参数至关重要
  // 如何友好使用 最简单的是什么
  // 一维数组
  // 多个列的时候涉及多维数组 [{options: [], child: {}}, {}]
  // {options, child}
  @Input() data: Array<any>;

  // 输出参数
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() scrollChange: EventEmitter<any> = new EventEmitter();
  @Output() changeSelectedItem: EventEmitter<any> = new EventEmitter();

  @ViewChildren(PickerColumnComponent) columns: QueryList<PickerColumnComponent>;

  private _value;

  // 完成动画事件
  public animateEvent;

  // 是否显示了picker的dom结构
  public isShowPicker: boolean = false;

  // 内部显示的值
  public innerValue;


  constructor() {
    super();
  }

  ngOnInit(): void {

  }

  onAnimateDone(e) {
    this.animateEvent = e;

    let isShow = e.toState === 'active';
    if (isShow !== this.isShowPicker) {
      this.isShowPicker = isShow;
    }
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
    this.setInnerValue();
  }

  // 点击确定
  // 收集所有的值
  onConfirm() {
    let values = [], items = [];
    let columns: PickerColumnComponent[] = this.columns.toArray(), column;

    // 收集结果
    for (let i = 0, l = columns.length; i < l; i++) {
      column = columns[i];
      values.push(column.value);
      items.push(column.selectedItem);
    }

    // 最后如果是单选 不需要采用数组
    if (!this.isMulti) {
      values = values[0];
      items = items[0];
    }

    // 触发事件
    this._value = values;
    this.valueChange.emit(values);
    this.changeSelectedItem.emit(items);
  }

  @Input()
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      this.setInnerValue();
    }
  }

  get value(): any {
    return this._value;
  }

  // [{options: [{ cityId: 11, child: {options: []} ] }]
  onScrollEnd(e, index ?: number) {
    if (this.isMulti && index < this.data.length - 1 && e.item && e.item.child) {
      this.data[index + 1] = e.item.child;
    }
  }

  setInnerValue() {
    let value = this.value;

    // 多选的话必须复制，否则对象值的改变无法触发
    if (this.isMulti) {
      value = value || [];
      this.innerValue = [];

      for (let i = 0; i < value.length; i++) {
        this.innerValue[i] = value[i];
      }
    } else {
      this.innerValue = value;
    }
  }
}
