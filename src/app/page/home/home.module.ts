import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import {HomeRoutingModule} from "./home-routing.module";
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {DatePickerModule} from "../../lib/modules/date.picker.module";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRoutingModule,
    CommonComponentsModule,
    DatePickerModule
  ],
  providers: [RouterService]
})
export class HomeModule { }
