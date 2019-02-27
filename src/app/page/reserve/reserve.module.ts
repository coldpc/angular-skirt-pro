import { NgModule } from '@angular/core';
import { ReserveComponent } from './reserve/reserve.component';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {ReserveRoutingModule} from "./reserve-routing.module";
import {RouterService} from "../../lib/service/router/RouterService";
import { FormItemComponent } from './form-item/form-item.component';
import {PickerModule} from "../../lib/modules/picker.module";

@NgModule({
  declarations: [ReserveComponent, FormItemComponent],
  imports: [
    ReserveRoutingModule,
    CommonComponentsModule,
    PickerModule
  ],
  providers: [RouterService]
})
export class ReserveModule { }
