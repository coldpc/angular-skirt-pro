import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JinrongjieComponent} from "./jinrongjie/jinrongjie.component";

const homeRoutes: Routes = [
  {
    path: '',
    component: JinrongjieComponent
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
export class JinrongjieRoutingModule { }
