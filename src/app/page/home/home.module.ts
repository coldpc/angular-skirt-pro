import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import {HomeRoutingModule} from "./home-routing.module";
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {RouterService} from "../../lib/service/router/RouterService";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRoutingModule,
    CommonComponentsModule
  ],
  providers: [RouterService]
})
export class HomeModule { }
