import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";
import {UtilsBase} from "../../../lib/utils/UtilsBase";
import {AreaData} from "../../../lib/utils/AreaData";
import {ApiCitiesMapService} from "../../../lib/service/http/api/ApiCitiesMapService";
import {ApiDistributorsService} from "../../../lib/service/http/api/ApiDistributorsService";
import {ApiReserveService} from "../../../lib/service/http/api/ApiReserveService";
import {DateApi} from "../../../lib/utils/DateApi";
import {DialogService} from "../../../lib/service/system/dialog.service";
import {EnHistoryState} from "../../../lib/enums/EnHistoryState";

interface InSelectValue {
  text ?: string;
  value ?: string;
}

const testData = [];

@Component({
  selector: 'sk-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss']
})
export class ReserveComponent implements OnInit, AfterViewInit {

  @ViewChild("bg") bgRef: ElementRef;
  @ViewChild("checkBox") checkBoxRef: ElementRef;

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

  // 显示协议窗口
  isShowProtocol: boolean = false;

  submitForm = {
    userName: '',
    mobile: '',
    province: '',
    city: '',
    distributor: '',
    timeStart: ''
  };

  carData = [{
      text: "汉州",
      value: "11"
    }, {
    text: "背景",
    value: "111"
  }];

  constructor(private routerService: RouterService,
              private dialogService: DialogService,
              private apiCitiesMapService: ApiCitiesMapService,
              private apiReserveService: ApiReserveService,
              private apiDistributorsService: ApiDistributorsService) {
  }

  ngOnInit() {
    this.apiCitiesMapService.request((res) => {
      this.onLoadCities(res);
    });
  }

  onLoadCities(data) {
    let res = [], child, temp;

    for (let key in data) {
      temp = data[key];
      child = [];

      for (let i = 0; i < temp.length; i++) {
        child.push({
          value: temp[i],
          text: temp[i]
        });
      }
      res.push({value: key, text: key, child});
    }
    this.provinceData = res;
  }

  loadMerchant(city) {
    this.apiDistributorsService.setBody({
      city: this.selectCity.value,
      province: this.selectProvince.value
    }).request((data) => {
      let res = [];
      for (let i = 0; i < data.length; i++) {
        res.push({value: data[i], text: data[i]});
      }
      city.child = res;
      this.merchantData = res;
    });
  }

  onTapBack() {
    this.routerService.gotoBack();
  }

  ngAfterViewInit(): void {
    this.bgRef.nativeElement.style.minHeight = UtilsBase.getClient().height + 'px';
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

  onChangeSelect(selectedItem, type) {
    if (!selectedItem) {
      return;
    }

    let item = selectedItem;

    if (type === 'province' && item.value !== this.selectProvince.text) {
      this.selectProvince = item;
      this.submitForm.province = selectedItem.text;

      this.cityData = item.child;
      this.selectCity = {};
      this.selectMerchant = {};
    }

    if (type === 'city' && item.value !== this.selectCity.text) {
      this.selectCity = item;
      this.submitForm.city = selectedItem.text;
      this.selectMerchant = {};

      if (item.child) {
        this.merchantData = item.child;
      } else {
        this.merchantData = [];
        this.loadMerchant(item);
      }
    }

    if (type === 'merchant') {
      this.selectMerchant = item;
      this.submitForm.distributor = selectedItem.text;
    }
  }

  onChangeValue(value, name) {
    this.submitForm[name] = value;
  }

  onSubmit() {
    let {submitForm, selectProvince, selectCity, selectMerchant} = this;

    // 选择的数据
    submitForm = UtilsBase.deepCopy(submitForm);
    submitForm.city = selectCity.value;
    submitForm.province = selectProvince.value;
    submitForm.distributor = selectMerchant.value;
    // submitForm.timeStart = DateApi.formatDate(submitForm.timeStart, 'yyyyMMdd');

    let message = this.checkData(submitForm);
    if (message) {
      return this.dialogService.alert(message);
    }

    this.apiReserveService.setBody(submitForm).request(() => {
      this.routerService.gotoGetAward(submitForm.mobile, EnHistoryState.replace);
    });
  }

  checkData(submitForm) {
    let error;

    if (!this.checkBoxRef.nativeElement.checked) {
      return '请勾选用户协议';
    }

    if (!submitForm.userName) {
      error = '请输入姓名';
    } else if (!this.checkMobile(submitForm.mobile)) {
      error = '请输入11位数手机号';
    } else if (!submitForm.city) {
      error = '请选择城市';
    } else if (!submitForm.province) {
      error = '请选择省区';
    } else if (!submitForm.distributor) {
      error = '请选择特约门店';
    }
    return error;
  }

  // 检验手机号
  checkMobile(str) {
    let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!str || !reg.test(str)) {
      return false;
    }
    return true;
  }

  showProtocol() {
    this.isShowProtocol = true;
  }
}


function ctrlData(areaData) {
  let result = [{options: areaData}, {}];
  for (let i = 0; i < areaData.length; i++) {
    areaData[i].child = {options: areaData[i].child};
  }
  return result;
}
