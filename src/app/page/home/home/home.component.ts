import {Component, OnInit} from '@angular/core';
import {EnButtonSize} from "../../../lib/enums/EnButtonSize";
import {DialogService} from "../../../lib/service/system/dialog.service";
import {EnButtonType} from "../../../lib/enums/EnButtonType";
import {HttpClientCore} from "../../../lib/service/http/HttpClientCore";
import {LoadingService} from "../../../lib/service/system/loading.service";

@Component({
  selector: 'sk-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imgSrc = "/assets/test.jpg";
  isShowMask = false;

  EnButtonType = EnButtonType;
  EnButtonSize = EnButtonSize;

  constructor(private dialogService: DialogService,
              private loadingService: LoadingService,
              private httpClientCore: HttpClientCore<any>) {

    this.httpClientCore
      .setPath("/product/index/get-city-list")
      .setParams({name: 'pccold', a: 'a'})
      .setBody({test: '123', password: 'asfd'})
      .subscribeError((error) => {
        console.log('error');
      })
      .subscribeComplete(() => {
        console.log('complete');
      })
      .subscribe((data) => {
        console.log('load');
      });
  }

  ngOnInit() {
  }

  onTapImg() {
    this.getRemoteData();
  }

  onTapButton() {
    // this.isShowMask = true;
    this.dialogService.confirm({
      message: "确定要删除订单吗？",
      onOk: this.onConfirm
    });
  }

  onConfirm() {
    console.log("ok");
  }

  onCancel() {
    console.log('cancel');
  }

  getRemoteData() {
    this.loadingService.show();
    this.httpClientCore.request();
  }

  onLoadData(data) {
    console.log(data);
  }

  onError(error) {
    console.log(error.message);
  }
}
