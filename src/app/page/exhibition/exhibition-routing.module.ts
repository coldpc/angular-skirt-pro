import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ExhibitionComponent} from "./exhibition/exhibition.component";

const homeRoutes: Routes = [
  {
    path: '',
    component: ExhibitionComponent
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
export class ExhibitionRoutingModule { }
