import { NgModule } from '@angular/core';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {ForumRoutingModule} from "./forum-routing.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {ForumComponent} from "./forum/forum.component";
import {SwiperModule} from "../../lib/modules/swiper.module";

@NgModule({
  declarations: [ForumComponent],
  imports: [
    ForumRoutingModule,
    CommonComponentsModule,
    SwiperModule
  ],
  providers: [RouterService]
})
export class ForumModule { }
