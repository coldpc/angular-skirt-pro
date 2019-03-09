import { NgModule } from '@angular/core';
import { YaoqinghanComponent } from './yaoqinghan/yaoqinghan.component';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {DatePickerModule} from "../../lib/modules/date.picker.module";
import {YaoqinghanRoutingModule} from './yaoqinghan-routing.module';
import {ApiLotteryGetService} from 'src/app/lib/service/http/api/ApiLotteryGetService';

@NgModule({
  declarations: [YaoqinghanComponent],
  imports: [
    YaoqinghanRoutingModule,
    CommonComponentsModule,
    DatePickerModule
  ],
  providers: [RouterService, ApiLotteryGetService]
})
export class YaoqinghanModule { }
