import { NgModule } from '@angular/core';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {ZhanlanRoutingModule} from "./zhanlan-routing.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {ZhanlanComponent} from "./zhanlan/zhanlan.component";
import { ImgViewerComponent } from './img-viewer/img-viewer.component';

@NgModule({
  declarations: [ZhanlanComponent, ImgViewerComponent],
  imports: [
    ZhanlanRoutingModule,
    CommonComponentsModule
  ],
  providers: [RouterService]
})
export class ZhanlanModule { }
