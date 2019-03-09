import { Component, OnInit, Input } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";
import {EnHistoryState} from "../../../lib/enums/EnHistoryState";

@Component({
  selector: 'sk-car-price',
  templateUrl: './car-price.component.html',
  styleUrls: ['./car-price.component.scss']
})
export class CarPriceComponent implements OnInit {

  @Input() isYaoqinghan: boolean = false;
  constructor(private routeService: RouterService) { }

  ngOnInit() {
  }

  gotoJinrongjie() {
    this.routeService.gotoReserve(EnHistoryState.replace);
  }

  gotoGaming() {

  }
}
