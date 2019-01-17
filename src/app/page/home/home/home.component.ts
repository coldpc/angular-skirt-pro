import { Component, OnInit } from '@angular/core';
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
              private httpClientCore: HttpClientCore) { }

  ngOnInit() {
    this.httpClientCore.request({
      url: 'test',
      data: {
        name: 'pccold'
      }
    }).subscribe((res) => {

    }, (error) => {

    });
  }

  onTapImg() {
    this.dialogService.alert("这里的 loadComponent() 方法很重要。 来一步步看看。首先，它选取了一个广告。");
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
}
