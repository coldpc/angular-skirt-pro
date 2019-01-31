import { NgModule } from '@angular/core';
import {ApartmentsComponent} from "./apartments/apartments.component";
import {ApartmentsRoutingModule} from "./apartments-routing.module";
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {ApiApartmentListService} from "../../lib/service/http/api/ApiApartmentListService";
import {CityModule} from "../../lib/modules/city.module";
import {RouterService} from "../../lib/service/router/RouterService";

@NgModule({
  declarations: [ApartmentsComponent],
  imports: [
    ApartmentsRoutingModule,
    CommonComponentsModule,
    CityModule
  ],
  providers: [ApiApartmentListService, RouterService]
})
export class ApartmentsModule { }
