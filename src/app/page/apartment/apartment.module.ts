import { NgModule } from '@angular/core';
import { ApartmentComponent } from './apartment/apartment.component';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {ApartmentRoutingModule} from "./apartment-routing.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {GetApartmentDetailService} from "../../lib/service/http/api/GetApartmentDetailService";
import {GradientComponent} from "../../components/gradient/gradient.component";
import {SwiperSlideComponent} from 'src/app/components/swiper/swiper-slide/swiper-slide.component';
import {SwiperComponent} from "../../components/swiper/swiper.component";

@NgModule({
  declarations: [ApartmentComponent, GradientComponent,
    SwiperSlideComponent, SwiperComponent],
  imports: [
    ApartmentRoutingModule,
    CommonComponentsModule
  ],
  providers: [RouterService, GetApartmentDetailService]
})
export class ApartmentModule { }
