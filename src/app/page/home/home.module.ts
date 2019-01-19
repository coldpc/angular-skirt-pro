import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import {HomeRoutingModule} from "./home-routing.module";
import {CommonComponentsModule} from "../../lib/modules/common.components.module";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRoutingModule,
    CommonComponentsModule
  ]
})
export class HomeModule { }
