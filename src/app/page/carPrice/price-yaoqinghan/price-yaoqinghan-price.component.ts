import { Component, OnInit } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";

@Component({
  selector: 'sk-vip-price',
  templateUrl: './price-yaoqinghan-price.component.html',
  styleUrls: ['./price-yaoqinghan-price.component.scss']
})
export class PriceYaoqinghanPriceComponent implements OnInit {

  constructor(private routeService: RouterService) { }

  ngOnInit() {
  }

}
