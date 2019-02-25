import { NgModule } from '@angular/core';
import { ApartmentComponent } from './apartment/apartment.component';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {ApartmentRoutingModule} from "./apartment-routing.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {GetApartmentDetailService} from "../../lib/service/http/api/GetApartmentDetailService";
import {GradientComponent} from "../../components/gradient/gradient.component";
import {SwiperModule} from "../../lib/modules/swiper.module";

@NgModule({
  declarations: [ApartmentComponent, GradientComponent],
  imports: [
    ApartmentRoutingModule,
    CommonComponentsModule,
    SwiperModule
  ],
  providers: [RouterService, GetApartmentDetailService]
})
export class ApartmentModule { }
