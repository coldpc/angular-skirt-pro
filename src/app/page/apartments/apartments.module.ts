import { NgModule } from '@angular/core';
import {ApartmentsComponent} from "./apartments/apartments.component";
import {ApartmentsRoutingModule} from "./apartments-routing.module";
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {ApiApartmentListService} from "../../lib/service/http/api/ApiApartmentListService";
import {TagComponent} from "../../components/tag/tag.component";
import {CityModule} from "../../lib/modules/city.module";

@NgModule({
  declarations: [ApartmentsComponent, TagComponent],
  imports: [
    ApartmentsRoutingModule,
    CommonComponentsModule,
    CityModule
  ],
  providers: [ApiApartmentListService]
})
export class ApartmentsModule { }
