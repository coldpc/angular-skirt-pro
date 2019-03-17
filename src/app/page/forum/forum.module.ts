import { NgModule } from '@angular/core';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {ForumRoutingModule} from "./forum-routing.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {ForumComponent} from "./forum/forum.component";
import {SwiperModule} from "../../lib/modules/swiper.module";
import {ApiStationListService} from "../../lib/service/http/api/ApiStationListService";
import {PickerModule} from "../../lib/modules/picker.module";
import {ApiStationImgListService} from "../../lib/service/http/api/ApiStationImgListService";
import { MediaListComponent } from './media-list/media-list.component';

@NgModule({
  declarations: [ForumComponent, MediaListComponent],
  imports: [
    ForumRoutingModule,
    CommonComponentsModule,
    SwiperModule,
    PickerModule
  ],
  providers: [RouterService, ApiStationListService, ApiStationImgListService]
})
export class ForumModule { }
