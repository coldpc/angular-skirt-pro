import { NgModule } from '@angular/core';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {CarsRoutingModule} from "./cars-routing.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {GetApartmentDetailService} from "../../lib/service/http/api/GetApartmentDetailService";
import {CarsComponent} from "./cars/cars.component";

@NgModule({
  declarations: [CarsComponent],
  imports: [
    CarsRoutingModule,
    CommonComponentsModule
  ],
  providers: [RouterService, GetApartmentDetailService]
})
export class CarsModule { }
