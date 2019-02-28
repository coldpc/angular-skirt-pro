import { Component, OnInit } from '@angular/core';
import {GetApartmentDetailService} from "../../../lib/service/http/api/GetApartmentDetailService";
import {RouterService} from "../../../lib/service/router/RouterService";
import {InApartmentModel} from "../../../lib/service/http/api/ApiApartmentListService";
import {EnTagSize} from 'src/app/lib/enums/EnTagSize';
import {EnButtonSize} from 'src/app/lib/enums/EnButtonSize';
import {EnButtonType} from "../../../lib/enums/EnButtonType";
import {AreaData} from "../../../lib/utils/AreaData";

@Component({
  selector: 'sk-jinrongjie',
  templateUrl: './jinrongjie.component.html',
  styleUrls: ['./jinrongjie.component.scss']
})
export class JinrongjieComponent implements OnInit {

  areaData = ctrlData(AreaData);
  carData = [{
    text: "雷凌HPEV",
    value: "11"
  }, {
    text: "雷凌HPEV3123",
    value: "111"
  }];
  configData = [{
    text: "2.4L舒适版",
    value: "11"
  }, {
    text: "2.9L豪华版",
    value: "111"
  }];

  isLoading = false;

  // 选择车型
  isShowCar = false;
  selectCar = {};
  // 选择配置
  isShowConfig = false;
  selectConfig = {};

  // 选择地区
  isShowArea = false;
  selectAreaText = "";
  selectArea = {};

  EnTagSize = EnTagSize;

  EnButtonSize = EnButtonSize;
  EnButtonType = EnButtonType;

  apartmentDetail: InApartmentModel;

  constructor(private getApartmentDetailService: GetApartmentDetailService,
              private routerService: RouterService) {

  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // this.getApartmentDetailService
    //   .setBody(this.routerService.queryParams.apartmentId)
    //   .showLoading()
    //   .request((data) => {
    //     this.onLoadData(data);
    //   }, null, () => {
    //     this.isLoading = false;
    //   });
  }

  onLoadData(data) {
    this.apartmentDetail = data;
  }

  onTapBack() {
    this.routerService.gotoBack();
  }

  onChangeArea(item) {
    this.selectArea = item;
    console.log(item);

    this.selectAreaText = item[0].name + " " + item[1].name;
  }

  onChangeCar(item) {
    this.selectCar = item;
  }

  onChangeConfig(item) {
    this.selectConfig = item;
  }

}

function ctrlData(areaData) {
  let result = [{options: areaData}, {}];
  for (let i = 0; i < areaData.length; i++) {
    areaData[i].child = {options: areaData[i].child}
  }
  return result;
}
