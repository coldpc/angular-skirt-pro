import { NgModule } from '@angular/core';
import {ApartmentsComponent} from "./apartments/apartments.component";
import {ApartmentsRoutingModule} from "./apartments-routing.module";
import {CommonComponentsModule} from "../../lib/modules/common.components.module";

@NgModule({
  declarations: [ApartmentsComponent],
  imports: [
    ApartmentsRoutingModule,
    CommonComponentsModule
  ]
})
export class ApartmentsModule { }
