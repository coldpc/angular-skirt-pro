import { Component, OnInit } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";

@Component({
  selector: 'sk-car-price',
  templateUrl: './car-price.component.html',
  styleUrls: ['./car-price.component.scss']
})
export class CarPriceComponent implements OnInit {

  constructor(private routeService: RouterService) { }

  ngOnInit() {
  }

  gotoJinrongjie() {
    this.routeService.gotoReserve();
  }

}
