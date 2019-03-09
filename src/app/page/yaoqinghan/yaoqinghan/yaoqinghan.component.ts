import { Component } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";

@Component({
  selector: 'sk-yaoqinghan',
  templateUrl: './yaoqinghan.component.html',
  styleUrls: ['./yaoqinghan.component.scss']
})
export class YaoqinghanComponent {
  title: string = "ddd";  // 组件类操作模板
  aaa: string = "123456";

  constructor(private service: RouterService) {

  }

  onTapOk() {
    this.service.gotoCarPrice();
  }

}
