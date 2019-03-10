import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VipjizhanComponent } from './vipjizhan/vipjizhan.component';
import {QiangXianTiYanComponent} from "./qiang-xian-ti-yan/qiang-xian-ti-yan.component";
import {XunzhaoComponent} from "./xunzhao/xunzhao.component";

const homeRoutes: Routes = [
  {
    path: '',
    component: VipjizhanComponent
  },
  {
    path: 'tiyan',
    component: QiangXianTiYanComponent
  },
  {
    path: 'xunzhao',
    component: XunzhaoComponent
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
