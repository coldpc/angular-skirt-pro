import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {EnButtonSize} from "../../../lib/enums/EnButtonSize";
import {DialogService} from "../../../lib/service/system/dialog.service";
import {EnButtonType} from "../../../lib/enums/EnButtonType";
import {ApiCoreService} from "../../../lib/service/http/ApiCoreService";
import {LoadingService} from "../../../lib/service/system/loading.service";
import {RouterService} from "../../../lib/service/router/RouterService";
import {EnHistoryState} from "../../../lib/enums/EnHistoryState";
import {SkEasyScroller} from "../../../lib/utils/ZScroller/SkEasyScroller";

@Component({
  selector: 'sk-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  imgSrc = "/assets/test.jpg";
  isShowMask = false;

  year = [4401, 3101];

  EnButtonType = EnButtonType;
  EnButtonSize = EnButtonSize;

  cityList: Array<any> = [];

  scroll: SkEasyScroller;

  @ViewChild("list") list: ElementRef;

  constructor(private dialogService: DialogService,
              private loadingService: LoadingService,
              private httpClientCore: ApiCoreService<any>,
              private routerService: RouterService) {



    window['test'] = this;
    this.getRemoteData();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.scroll = new SkEasyScroller(this.list.nativeElement, {
      scrollingX: true,
      scrollingY: false,
      snapping: false
    });
    this.scroll.scroller.setSnapSize(this.list.nativeElement.parentNode.offsetWidth, 0);
  }

  onTapImg() {
    this.dialogService.confirm({
      message: "确定要退出吗？"
    });
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
