import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VipjizhanComponent } from './vipjizhan/vipjizhan.component';

const homeRoutes: Routes = [
  {
    path: '',
    component: VipjizhanComponent
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
export class VipjizhanRoutingModule { }
