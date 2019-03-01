import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";
import {UtilsBase} from "../../../lib/utils/UtilsBase";
import {SkEasyScroller} from "../../../lib/utils/ZScroller/SkEasyScroller";
import {AreaData} from "../../../lib/utils/AreaData";

@Component({
  selector: 'sk-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss']
})
export class ReserveComponent implements OnInit, AfterViewInit {

  @ViewChild("bg") bg: ElementRef;
  @ViewChild("inputBack") inputBack: ElementRef;
  @ViewChild("scrollContent") scrollContent: ElementRef;
  @ViewChild("form") form: ElementRef;

  areaData = ctrlData(AreaData);

  zScroller: any;
  itemHeight: number = 0;
  focusIndex: number = 0; // 当前输入

  // 选择车型
  isShowCar: boolean = false;
  selectCar = {text: ""};

  // 选择经销商
  isShowMerchant: boolean = false;

  // 选择地区
  isShowArea = false;
  selectAreaText = "";
  selectArea = {};

  carData = [{
      text: "汉州",
      value: "11"
    }, {
    text: "背景",
    value: "111"
  }];

  constructor(private routerService: RouterService) {

  }

  ngOnInit() {

  }

  onTapBack() {
    this.routerService.gotoBack();
  }

  ngAfterViewInit(): void {
    this.bg.nativeElement.style.minHeight = UtilsBase.getClient().height + 'px';

    let scrollContent = this.scrollContent.nativeElement;
    let form = this.form.nativeElement;

    // 设置滚动区域的高度
    scrollContent.parentNode.style.height = scrollContent.offsetHeight + 'px';


    form.style.paddingBottom = (form.offsetHeight - form.children[0].offsetHeight)  + 'px';


    let zScroller = this.zScroller = new SkEasyScroller(scrollContent, {
      scrollingX: false,
      scrollingY: true,
      snapping: true, // 滚动结束之后 滑动对应的位置
      scrollingComplete: this.onScrollComplete.bind(this),
      onScroll: this.onScroll.bind(this)
    });

    this.itemHeight = form.children[1].offsetHeight;
    // 设置每个格子的高度 这样滚动结束 自动滚到对应格子上
    // 单位必须是px 所以要动态取一下
    zScroller.scroller.setSnapSize(0, this.itemHeight);
  }

  onScrollComplete() {

  }

  onScroll() {
    // 滚动条不存在的时候
    if (!this.zScroller || !this.zScroller.scroller) {
      return;
    }

    // 取出top 根据top计算当前选中的item
    let top = this.zScroller.scroller.getValues().top || 0;
    this.focusIndex = Math.round(top / this.itemHeight);;
  }

  onTapItem(index, type ?: string) {
    setTimeout(() => {
      this.scrollToIndex(index);
    }, 10);

    if (type === 'car') {
      this.isShowCar = true;
    }

    if (type === 'area') {
      this.isShowArea = true;
    }
  }

  scrollToIndex(index) {
    this.zScroller.scroller.scrollTo(0, this.itemHeight * index, true);
  }

  onChangeCar(item) {
    this.selectCar = item;
  }

  onChangeArea(item) {
    this.selectArea = item;
    console.log(item);

    this.selectAreaText = item[0].name + " " + item[1].name;
  }

  onSubmit() {
    console.log(this.selectArea, this.selectCar);
  }
}


function ctrlData(areaData) {
  let result = [{options: areaData}, {}];
  for (let i = 0; i < areaData.length; i++) {
    areaData[i].child = {options: areaData[i].child}
  }
  return result;
}
