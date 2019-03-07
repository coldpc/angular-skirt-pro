import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AwardComponent} from "./award/award.component";

const homeRoutes: Routes = [
  {
    path: '',
    component: AwardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AwardRoutingModule { }
