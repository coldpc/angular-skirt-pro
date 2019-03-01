import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CarPriceComponent} from "./car-price/car-price.component";

const homeRoutes: Routes = [
  {
    path: '',
    component: CarPriceComponent
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
