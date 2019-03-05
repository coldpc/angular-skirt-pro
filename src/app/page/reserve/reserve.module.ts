import { NgModule } from '@angular/core';
import { ReserveComponent } from './reserve/reserve.component';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {ReserveRoutingModule} from "./reserve-routing.module";
import {RouterService} from "../../lib/service/router/RouterService";
import { FormItemComponent } from './form-item/form-item.component';
import {PickerModule} from "../../lib/modules/picker.module";
import { ProtocolComponent } from './protocol/protocol.component';
import {ApiCitiesMapService} from "../../lib/service/http/api/ApiCitiesMapService";
import {ApiDistributorsService} from "../../lib/service/http/api/ApiDistributorsService";
import {ApiReserveService} from "../../lib/service/http/api/ApiReserveService";

@NgModule({
  declarations: [ReserveComponent, FormItemComponent, ProtocolComponent],
  imports: [
    ReserveRoutingModule,
    CommonComponentsModule,
    PickerModule
  ],
  providers: [RouterService, ApiCitiesMapService, ApiDistributorsService, ApiReserveService]
})
export class ReserveModule { }
