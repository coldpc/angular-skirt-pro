import {Component, OnInit} from '@angular/core';
import {EnButtonSize} from "../../../lib/enums/EnButtonSize";
import {DialogService} from "../../../lib/service/system/dialog.service";
import {EnButtonType} from "../../../lib/enums/EnButtonType";
import {ApiCoreService} from "../../../lib/service/http/ApiCoreService";
import {LoadingService} from "../../../lib/service/system/loading.service";
import {RouterService} from "../../../lib/service/router/RouterService";
import {EnHistoryState} from "../../../lib/enums/EnHistoryState";

@Component({
  selector: 'sk-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imgSrc = "/assets/test.jpg";
  isShowMask = true;

  year = [4401, 3101];

  EnButtonType = EnButtonType;
  EnButtonSize = EnButtonSize;

  cityList: Array<any> = [];

  constructor(private dialogService: DialogService,
              private loadingService: LoadingService,
              private httpClientCore: ApiCoreService<any>,
              private routerService: RouterService) {



    window['test'] = this;
    this.getRemoteData();
  }

  ngOnInit() {
  }

  onTapImg() {
  }

  onTapButton() {
    this.routerService.gotoApartments({
      params: {cityId: 1, cityName: "权国"}
    });
  }

  onConfirm() {
    console.log("ok");
  }

  onCancel() {
    console.log('cancel');
  }

  getRemoteData() {
    this.httpClientCore
      .setPath("/product/index/get-city-list")
      .setParams({name: 'pccold', a: 'a'})
      .setBody({test: '123', password: 'asfd'})
      .request((data) => {
        this.cityList = [{options: data}, {options: data}];
      });
  }

  onLoadData(data) {
    console.log(data);
  }

  onError(error) {
    console.log(error.message);
  }
}
