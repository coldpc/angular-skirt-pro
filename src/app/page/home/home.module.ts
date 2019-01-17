import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import {HomeRoutingModule} from "./home-routing.module";
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {SystemModule} from "../../lib/modules/system.module";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CommonComponentsModule,
    SystemModule
  ]
})
export class HomeModule { }
