import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YaoqinghanliuziComponent } from './yaoqinghanliuzi/yaoqinghanliuzi.component';

const homeRoutes: Routes = [
  {
    path: '',
    component: YaoqinghanliuziComponent
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
export class YaoqinghanModule { }
