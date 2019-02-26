import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReserveComponent} from "./reserve/reserve.component";

const homeRoutes: Routes = [
  {
    path: '',
    component: ReserveComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class ReserveRoutingModule { }
