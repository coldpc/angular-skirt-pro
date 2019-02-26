import { Component, OnInit } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";

@Component({
  selector: 'sk-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss']
})
export class ReserveComponent implements OnInit {

  constructor(private routerService: RouterService) {

  }

  ngOnInit() {
  }

  onTapBack() {
    this.routerService.gotoBack();
  }

}
