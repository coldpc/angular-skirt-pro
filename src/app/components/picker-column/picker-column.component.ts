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

import {InPickerSelectedValue} from "../../lib/interfaces/InPickerSelectedValue";
import {SkEasyScroller} from "../../lib/utils/ZScroller/SkEasyScroller";
import {UtilsBase} from "../../lib/utils/UtilsBase";

@Component({
  selector: 'sk-picker-column',
  templateUrl: './picker-column.component.html',
  styleUrls: ['./picker-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickerColumnComponent implements AfterViewChecked {

  // 输入参数
  @Input() displayField: string;
  @Input() valueField: string;

  // 输出参数
  @Output() valueChange: EventEmitter<InPickerSelectedValue> = new EventEmitter();
  @Output() scrollEnd: EventEmitter<InPickerSelectedValue> = new EventEmitter();

  // 计算itemHeight
  @ViewChild("indicatorRef") indicatorRef: ElementRef;

  @ViewChild("listRef") listRef: ElementRef;

  // 选项的值
  private _value: any;
  private _data: Array<any> = [];

  // 是否显示至关重要
  private _isShow: boolean = false;


  zScroller: SkEasyScroller;

  // 选中的项索引
  selectedIndex: number = 0;
  selectedItem: any;

  // 每一项的高度
  itemHeight: number;

  // 标记
  hasChange = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    changeDetectorRef.detach();
  }

  @Input()
  set value(value: any) {
    if (this.value !== value) {
      if (this.isShow) {
        this.hasChange = true;
      }
      this._value = value;
    }
  }

  get value(): any {
    return this._value;
  }

  @Input()
  set isShow(isShow: boolean) {
    if (this._isShow !== isShow) {
      this._isShow = isShow;

      if (isShow && !this.hasChange) {
        this.hasChange = true;
      }
    }
  }

  get isShow(): boolean {
    return this._isShow;
  }

  @Input()
  set data(data: Array<any>) {
    data = data || [];
    if (!(this.data.length === 0 && data.length === 0)) {
      this._data = data;
      if (this.isShow && !this.hasChange) {
        this.hasChange = true;
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  get data(): Array<any> {
    return this._data;
  }

  ngAfterViewChecked() {
    // 改变数据的时候
    if (this.isShow && this.hasChange) {
      if (this.zScroller) {
        // 重新设置尺寸
        this.zScroller.reflow();

        // 重新设置选中的value
        this.focusValue(this.value);
      } else {
        this.initScroll();
      }
      this.hasChange = false;
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
  initScroll() {
    // 没数据或者已经创建过
    if (!this.zScroller && this.data && this.data.length > 1) {
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

      let index = this.getIndexByValue(this.value);
      if (index > 0 ) {
        this.scrollToIndex(index, true);
      }
    }

  }

  getItemHeight(): number {
    let indicatorRef = this.indicatorRef;
    if (indicatorRef && indicatorRef.nativeElement) {
      return indicatorRef.nativeElement.getBoundingClientRect().height;
    }
  }

  /**
   * 滚动事件
   * @param left 左边的滚动距离
   * @param top 顶部距离
   * @param zoom 缩放
   */
  onScroll(left, top, zoom) {
    this.recountSelectedValue(top);
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
  focusValue(value) {
    let index = this.getIndexByValue(value);
    if (index !== this.selectedIndex) {
      this.scrollToIndex(index > -1 ? index : 0);
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
    let data = this.data || [], index = -1;
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
  private setValue(index, item) {
    this.selectedItem = item;
    this.selectedIndex = index;

    this._value = this.getValue(item);
    this.valueChange.emit(this.value);
    this.changeDetectorRef.detectChanges();
  }

  onTouchMove(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }
}
