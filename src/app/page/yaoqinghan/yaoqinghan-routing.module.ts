import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YaoqinghanComponent } from './yaoqinghan/yaoqinghan.component';

const homeRoutes: Routes = [
  {
    path: '',
    component: YaoqinghanComponent
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
export class YaoqinghanRoutingModule { }
