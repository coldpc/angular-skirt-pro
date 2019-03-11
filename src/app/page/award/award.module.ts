import { NgModule } from '@angular/core';
import { AwardComponent } from './award/award.component';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {DatePickerModule} from "../../lib/modules/date.picker.module";
import {AwardRoutingModule} from './award-routing.module';
import {ResultComponent} from './result/result.component';
import {ApiLotteryGetService} from 'src/app/lib/service/http/api/ApiLotteryGetService';

@NgModule({
  declarations: [AwardComponent, ResultComponent],
  imports: [
    AwardRoutingModule,
    CommonComponentsModule,
    DatePickerModule
  ],
  providers: [RouterService, ApiLotteryGetService]
})
export class AwardModule { }
