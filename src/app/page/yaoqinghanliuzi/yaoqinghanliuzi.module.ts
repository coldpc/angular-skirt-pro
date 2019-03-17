import { NgModule } from '@angular/core';
import { RouterService } from "../../lib/service/router/RouterService";

import { YaoqinghanModule } from "./yaoqinghanliuzi-routing.module";
import { CommonComponentsModule } from "../../lib/modules/common.components.module";
import {YaoqinghanliuziComponent} from "./yaoqinghanliuzi/yaoqinghanliuzi.component";

@NgModule({
  declarations: [YaoqinghanliuziComponent],
  imports: [
    YaoqinghanModule,
    CommonComponentsModule
  ],
  providers: [RouterService]
})
export class yaoqinghanliuziModule { }
