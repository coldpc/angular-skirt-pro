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
import { ImgViewerComponent } from './img-viewer/img-viewer.component';
import {ApiMediaListService} from "../../lib/service/http/api/ApiMediaListService";
import {ApiMediaPageListService} from "../../lib/service/http/api/ApiMediaPageListService";

@NgModule({
  declarations: [ForumComponent, MediaListComponent, ImgViewerComponent],
  imports: [
    ForumRoutingModule,
    CommonComponentsModule,
    SwiperModule,
    PickerModule
  ],
  providers: [RouterService, ApiStationListService, ApiStationImgListService, ApiMediaListService, ApiMediaPageListService]
})
export class ForumModule { }
