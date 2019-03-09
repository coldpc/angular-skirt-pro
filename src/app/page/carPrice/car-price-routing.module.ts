import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CarPriceComponent} from "./car-price/car-price.component";
import {PriceYaoqinghanPriceComponent} from "./price-yaoqinghan/price-yaoqinghan-price.component";

const homeRoutes: Routes = [
  {
    path: '',
    component: CarPriceComponent
  },
  {
    path: 'vip-price',
    component: PriceYaoqinghanPriceComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class CarPriceRoutingModule { }
