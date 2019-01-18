import {Component, OnInit} from '@angular/core';
import {EnButtonSize} from "../../../lib/enums/EnButtonSize";
import {DialogService} from "../../../lib/service/system/dialog.service";
import {EnButtonType} from "../../../lib/enums/EnButtonType";
import {HttpClientCore} from "../../../lib/service/http/HttpClientCore";

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
              private httpClientCore: HttpClientCore<any>) {

    this.httpClientCore
      .setPath("/product/index/get-city-list")
      .setParams({name: 'pccold'})
      .setBody({test: '123', password: 'asfd'})
      .catchError()
      .subscribe((data) => {
        this.onLoadData(data);
      });

    this.httpClientCore.subscribeError((error) => {
      console.log(error);
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
    this.httpClientCore.request();
  }

  onLoadData(data) {
    console.log(data);
  }

  onError(error) {
    console.log(error.message);
  }
}
