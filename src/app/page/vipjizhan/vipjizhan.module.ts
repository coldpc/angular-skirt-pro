import { NgModule } from '@angular/core';
import { VipjizhanComponent } from './vipjizhan/vipjizhan.component';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {DatePickerModule} from "../../lib/modules/date.picker.module";
import {VipjizhanRoutingModule} from './vipjizhan-routing.module';
import {ApiLotteryGetService} from 'src/app/lib/service/http/api/ApiLotteryGetService';

@NgModule({
  declarations: [VipjizhanComponent],
  imports: [
    VipjizhanRoutingModule,
    CommonComponentsModule,
    DatePickerModule
  ],
  providers: [RouterService, ApiLotteryGetService]
})
export class VipjizhanModule { }
