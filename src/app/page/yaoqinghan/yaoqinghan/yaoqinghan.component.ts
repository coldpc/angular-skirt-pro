import {Component} from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";
import {EnHistoryState} from "../../../lib/enums/EnHistoryState";

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
    this.service.gotoVipPrice(EnHistoryState.replace);
  }

}
