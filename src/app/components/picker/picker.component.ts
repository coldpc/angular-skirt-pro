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
import {InPickerSelectedValue} from "../../lib/interfaces/InPickerSelectedValue";
import {TsEasyScroller} from "../../lib/utils/ZScroller/TsEasyScroller";

// 默认的valueFiled 和displayFiled
const DEFAULT_VALUE_FIELD = 'value';
const DEFAULT_DISPLAY_FIELD = 'text';

@Component({
  selector: 'sk-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss']
})
export class PickerComponent implements AfterViewInit {

  // 输入参数
  @Input() data: Array<any>;
  @Input() displayField: string = DEFAULT_DISPLAY_FIELD;
  @Input() valueField: string = DEFAULT_VALUE_FIELD;
  @Input() onValueChange: (arg: InPickerSelectedValue, _this?: PickerComponent) => void;

  // 输出参数
  @Output() valueChange: EventEmitter<InPickerSelectedValue> = new EventEmitter();
  @Output() scrollEnd: EventEmitter<InPickerSelectedValue> = new EventEmitter();

  // 选项的值
  private _value: any;
  @Input()
  set value(value: any) {
    this._value = value;
  }

  get value(): any {
    return this._value;
  }

  // 选择的项目
  private _selectedItem: any;
  set selectedItem(value: any) {
    this._selectedItem = value;
  }

  get selectedItem(): any {
    return this._selectedItem;
  }

  private _isShow: boolean = false;
  @Input()
  set isShow(isShow: boolean) {
    this._isShow = isShow;

    if (isShow) {
      this.init();
    }
  }
  get isShow(): boolean {
    return this._isShow;
  }

  // 选中的项索引
  selectedIndex: number;

  // 每一项的高度
  itemHeight: number;

  // 计算itemHeight
  @ViewChild("indicatorRef") indicatorRef: ElementRef;

  @ViewChild("listRef") listRef: ElementRef;

  zScroller: TsEasyScroller;

  constructor() {

  }

  ngAfterViewInit() {
    this.init();
  }

  init() {
    if (!this.zScroller && this.checkIsShow()) {
      this.bindScrollEvent();
    }
  }

  checkIsShow() {
    return this.indicatorRef.nativeElement.getBoundingClientRect().height > 10;
  }

  bindScrollEvent() {
    // getBoundingClientRect获取dom的尺寸
    // 根据变量判断dom是否渲染完毕
    this.itemHeight = this.indicatorRef.nativeElement.getBoundingClientRect().height;

    // 最后还是用了何一鸣的zscroll插件
    // 但是这个插件并没有太多的文档介绍 gg
    // 插件demo地址：http://yiminghe.me/zscroller/examples/demo.html
    let zScroller = this.zScroller = new TsEasyScroller(this.listRef.nativeElement, {
      scrollingX: false,
      snapping: false, // 滚动结束之后 滑动对应的位置
      scrollingComplete: this.onScrollComplete.bind(this)
    });

    let content = this.listRef.nativeElement;
    let container = content.parentNode;
    let rect = container.getBoundingClientRect();

    zScroller.scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);
    zScroller.scroller.setDimensions(container.clientWidth, container.clientHeight, content.offsetWidth, content.offsetHeight);

    // 设置每个格子的高度 这样滚动结束 自动滚到对应格子上
    // 单位必须是px 所以要动态取一下
    this.zScroller.scroller.setSnapSize(0, this.itemHeight);
  }

  // 新方法，在滚动完成时触发，和滚动事件有所区别
  onScrollComplete() {
    console.log(this.zScroller.scroller.__clientTop)
    this.scrollEnd.emit(this.selectedItem);
    this.recountSelectedValue();
  }

  // 重新计算选中的值
  recountSelectedValue() {
    let top, selectedIndex, data, floor;

    top = this.zScroller.scroller.getValues().top;
    if (!this.data || isNaN(top)) {
      return;
    }

    data = this.data;
    selectedIndex = Math.round(top / this.itemHeight);

    // item
    if (this.selectedIndex !== selectedIndex) {
      let selectedItem = data[selectedIndex];
      if (selectedItem) {
        this.setValue(selectedIndex, selectedItem);
      }
    }
  }

  // 滚动到index对应的位置
  scrollToIndex(index) {
    this.zScroller.scroller.scrollTo(0, this.itemHeight * index);
  }

  getValue(item) {
    return typeof item === 'object' ? item[this.valueField] : item;
  }

  getDisplay(item) {
    return typeof item === 'object' ? item[this.displayField] : item;
  }

  // 点击每一项
  onTapItem(index) {
    this.scrollToIndex(index);
  }

  setValue(index, item) {
    this.selectedIndex = index;
    this.selectedItem = item;
  }
}
