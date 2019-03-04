import { NgModule } from '@angular/core';
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {ExhibitionRoutingModule} from "./exhibition-routing.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {ExhibitionComponent} from "./exhibition/exhibition.component";

@NgModule({
  declarations: [ExhibitionComponent],
  imports: [
    ExhibitionRoutingModule,
    CommonComponentsModule
  ],
  providers: [RouterService]
})
export class ExhibitionModule { }
