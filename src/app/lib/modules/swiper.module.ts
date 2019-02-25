import { NgModule } from '@angular/core';
import {CommonComponentsModule} from "./common.components.module";
import {SwiperComponent} from "../../components/swiper/swiper.component";
import {SwiperSlideComponent} from "../../components/swiper/swiper-slide/swiper-slide.component";

// 系统加载的内容
const components = [
  SwiperComponent,
  SwiperSlideComponent
];

// 服务供应列表
const providers = [];

@NgModule({
  declarations: [...components],
  imports: [CommonComponentsModule],
  exports: [...components],
  providers: [...providers],
  entryComponents: []
})
export class SwiperModule { }
