import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import {isUndefined} from "util";
import {InPickerSelectedValue} from "../../lib/interfaces/InPickerSelectedValue";
import {SkEasyScroller} from "../../lib/utils/ZScroller/SkEasyScroller";
import {UtilsBase} from "../../lib/utils/UtilsBase";

// 默认的valueFiled 和displayFiled
const DEFAULT_VALUE_FIELD = 'value';
const DEFAULT_DISPLAY_FIELD = 'text';

@Component({
  selector: 'sk-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PickerComponent implements AfterViewChecked {

  // 输入参数
  @Input() displayField: string = DEFAULT_DISPLAY_FIELD;
  @Input() valueField: string = DEFAULT_VALUE_FIELD;

  // 输出参数
  @Output() valueChange: EventEmitter<InPickerSelectedValue> = new EventEmitter();
  @Output() scrollEnd: EventEmitter<InPickerSelectedValue> = new EventEmitter();

  // 选项的值
  private _value: any;

  // 是否显示
  private _isShow: boolean;

  private _data: Array<any>;

  // 计算itemHeight
  @ViewChild("indicatorRef") indicatorRef: ElementRef;

  @ViewChild("listRef") listRef: ElementRef;

  zScroller: SkEasyScroller;

  // 选中的项索引
  selectedIndex: number = 0;
  selectedItem: any;

  // 每一项的高度
  itemHeight: number;

  @Input()
  set value(value: any) {
    this._value = value;
    this.hasChangeValue = true;
  }

  get value(): any {
    return this._value;
  }

  @Input()
  set isShow(isShow: boolean) {

    if (this._isShow !== isShow) {
      this._isShow = isShow;

      if (isShow) {
        this.hasChangeShow = true;
      }
    }
  }

  get isShow(): boolean {
    return this._isShow;
  }

  @Input()
  set data(data: Array<any>) {
    this._data = data;
    this.hasChangeData = true;
    this.changeDetectorRef.detectChanges();
  }

  get data(): Array<any> {
    return this._data;
  }

  lastTop = 0;
  hasChangeData = false;
  hasChangeValue = false;
  hasChangeShow = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    changeDetectorRef.detach();
  }

  ngAfterViewChecked() {
    this.initView();
  }

  initView() {
    if (this.checkIsShow()) {
      if (!this.zScroller) {
        this.createScroll();
      } else {

        if (this.hasChangeData) {
          let index = this.getIndexByValue(this.value);
          if (index !== this.selectedIndex) {
            this.scrollToIndex(0);
          }
          this.hasChangeData = false;
        } else if (this.hasChangeValue && this.hasChangeShow) {
          this.scrollToValue(this.value);
        }

        this.hasChangeValue = false;
        this.hasChangeShow = false;
      }
    }
  }

  checkIsShow() {
    return this.data && this.data.length > 0 && this.getItemHeight() > 10;
  }

  getItemHeight(): number {
    let indicatorRef = this.indicatorRef;
    if (indicatorRef && indicatorRef.nativeElement) {
      return indicatorRef.nativeElement.getBoundingClientRect().height;
    }
  }

  getItemsLength(): number {
    let listRef = this.listRef;
    if (listRef && listRef.nativeElement) {
      return listRef.nativeElement.children.length;
    }
  }

  /**
   * 创建scroll
   */
  createScroll() {
    // getBoundingClientRect获取dom的尺寸
    // 根据变量判断dom是否渲染完毕
    this.itemHeight = this.getItemHeight();

    let zScroller = this.zScroller = new SkEasyScroller(this.listRef.nativeElement, {
      scrollingX: false,
      snapping: true, // 滚动结束之后 滑动对应的位置
      scrollingComplete: this.onScrollComplete.bind(this),
      onScroll: this.onScroll.bind(this)
    });

    // 设置每个格子的高度 这样滚动结束 自动滚到对应格子上
    // 单位必须是px 所以要动态取一下
    zScroller.scroller.setSnapSize(0, this.itemHeight);

    this.scrollToValue(this.value);
  }

  /**
   * 滚动事件
   * @param left 左边的滚动距离
   * @param top 顶部距离
   * @param zoom 缩放
   */
  onScroll(left, top, zoom) {
    if (top !== this.lastTop) {
      this.lastTop = top;
      this.recountSelectedValue(top);
    }
  }

  /**
   * 在滚动完成时触发，和滚动事件有所区别
   */
  onScrollComplete() {
    let selectedItem = this.selectedItem || this.data[0];
    this.scrollEnd.emit({value: this.getValue(selectedItem), item: selectedItem});
    this.recountSelectedValue();
  }

  /**
   * 重新计算选中的值
   * @param top 顶部值
   */
  recountSelectedValue(top ?: number) {
    let selectedIndex, data, selectedItem;

    // 滚动条不存在的时候
    if (!this.zScroller || !this.zScroller.scroller || !this.data) {
      return;
    }

    // 取出top 根据top计算当前选中的item
    top = top || this.zScroller.scroller.getValues().top || 0;
    data = this.data;
    selectedIndex = Math.round(top / this.itemHeight);
    selectedItem = data[selectedIndex];

    // 如果值发生改变
    if (this.selectedItem !== selectedItem) {
      this.setValue(selectedIndex, selectedItem);
    }
  }

  /**
   * 滚动到index对应的位置
   * @param index 滚动到索引
   * @param animate 是否需要动画
   */
  scrollToIndex(index, animate: boolean = true) {
    if (this.zScroller && this.zScroller.scroller && index < this.getItemsLength() ) {
      this.zScroller.scroller.scrollTo(0, this.itemHeight * index, animate);
    }
  }

  // 滚动到对应值的位置
  scrollToValue(value) {
    let index = this.getIndexByValue(value) || 0;
    if (index !== this.selectedIndex) {
      this.scrollToIndex(index, true);
    } else if (this.zScroller && this.zScroller.scroller && this.data && this.data.length > 0) {
      this.onScrollComplete();
    }
  }

  // 获取值
  getValue(item) {
    return typeof item === 'object' ? item[this.valueField] : item;
  }

  // 获取展示
  getDisplay(item) {
    return typeof item === 'object' ? item[this.displayField] : item;
  }

  // 获取选项根据值
  getIndexByValue(value): number {
    let data = this.data || [], index = 0;
    for (let i = 0, l = data.length; i < l; i++) {
      if (UtilsBase.checkIsEqual(this.getValue(data[i]), value)) {
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * 点击的时候滚动到那一项
   * 为何要用setTimeout,这是因为scroll有个小bug，
   * 只能采用延时计算方式，才不会被覆盖
   * @param index 第几项 从0开始
   */
  onTapItem(index) {
    setTimeout(() => {
      this.scrollToIndex(index);
    }, 10);
  }

  /**
   * 设置值
   * @param index 索引
   * @param item 项
   */
  setValue(index, item) {
    this.selectedItem = item;
    this.value = this.getValue(item);
    this.hasChangeValue = false;

    this.selectedIndex = index;
    this.valueChange.emit(this.value);
    this.changeDetectorRef.detectChanges();
  }
}
