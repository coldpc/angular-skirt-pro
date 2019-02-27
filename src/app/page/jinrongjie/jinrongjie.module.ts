import { NgModule } from '@angular/core';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {JinrongjieRoutingModule} from "./jinrongjie-routing.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {GetApartmentDetailService} from "../../lib/service/http/api/GetApartmentDetailService";
import {JinrongjieComponent} from "./jinrongjie/jinrongjie.component";

@NgModule({
  declarations: [JinrongjieComponent],
  imports: [
    JinrongjieRoutingModule,
    CommonComponentsModule
  ],
  providers: [RouterService, GetApartmentDetailService]
})
export class JinrongjieModule { }
