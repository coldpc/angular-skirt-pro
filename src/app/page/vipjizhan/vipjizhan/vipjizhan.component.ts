import {Component, OnInit} from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";

@Component({
  selector: 'sk-vipjizhan',
  templateUrl: './vipjizhan.component.html',
  styleUrls: ['./vipjizhan.component.scss']
})
export class VipjizhanComponent {


  constructor(private routerService: RouterService) {

  }

  gotoTiyan() {
    this.routerService.gotoTiyan();
  }

  gotoXunzhao() {
    this.routerService.gotoXunzhao();
  }
}
