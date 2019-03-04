import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";
import {UtilsBase} from "../../../lib/utils/UtilsBase";
import {SkEasyScroller} from "../../../lib/utils/ZScroller/SkEasyScroller";
import {AreaData} from "../../../lib/utils/AreaData";

interface InSelectValue {
  text ?: string;
  value ?: string;
}

const testData = [{
  text: "汉州",
  value: "11"
}, {
  text: "背景",
  value: "111"
}];

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

  focusIndex: number = 0; // 当前输入

  // 选择省
  selectProvince: InSelectValue = {};
  isShowProvince: boolean = false;
  provinceData = testData;

  // 选择地区
  selectCity: InSelectValue = {};
  isShowCity: boolean = false;
  cityData = testData;

  selectMerchant: InSelectValue = {};
  isShowMerchant: boolean = false;
  merchantData = testData;

  submitForm = {
    name: '',
    tel: '',
    date: ''
  };

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
  }

  onTapItem(index, type ?: string) {
    this.focusIndex = index;

    if (type === 'province') {
      this.isShowProvince = true;
    }

    if (type === 'city') {
      this.isShowCity = true;
    }

    if (type === 'merchant') {
      this.isShowMerchant = true;
    }
  }

  onChangeSelect(item, type) {
    if (type === 'province') {
      this.selectProvince = item;
    }

    if (type === 'city') {
      this.selectCity = item;
    }

    if (type === 'merchant') {
      this.selectMerchant = item;
    }
  }

  onChangeValue(value, name) {
    this.submitForm[name] = value;
    console.log(this.submitForm);
  }

  onSubmit() {
    console.log(this.selectMerchant, this.selectCity, this.selectProvince);
  }
}


function ctrlData(areaData) {
  let result = [{options: areaData}, {}];
  for (let i = 0; i < areaData.length; i++) {
    areaData[i].child = {options: areaData[i].child};
  }
  return result;
}
