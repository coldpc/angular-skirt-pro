import { NgModule } from '@angular/core';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {GetApartmentDetailService} from "../../lib/service/http/api/GetApartmentDetailService";
import {CarPriceComponent} from "./car-price/car-price.component";
import {CarPriceRoutingModule} from "./car-price-routing.module";

@NgModule({
  declarations: [CarPriceComponent],
  imports: [
    CarPriceRoutingModule,
    CommonComponentsModule
  ],
  providers: [RouterService, GetApartmentDetailService]
})
export class CarPriceModule { }
