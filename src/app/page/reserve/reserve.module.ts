import { NgModule } from '@angular/core';
import { ReserveComponent } from './reserve/reserve.component';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {ReserveRoutingModule} from "./reserve-routing.module";
import {RouterService} from "../../lib/service/router/RouterService";

@NgModule({
  declarations: [ReserveComponent],
  imports: [
    ReserveRoutingModule,
    CommonComponentsModule
  ],
  providers: [RouterService]
})
export class ReserveModule { }
