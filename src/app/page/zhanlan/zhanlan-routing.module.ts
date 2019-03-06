import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ZhanlanComponent} from "./zhanlan/zhanlan.component";

const homeRoutes: Routes = [
  {
    path: '',
    component: ZhanlanComponent
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
export class ZhanlanRoutingModule { }
