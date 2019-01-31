import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ApartmentComponent} from "./apartment/apartment.component";

const homeRoutes: Routes = [
  {
    path: '',
    component: ApartmentComponent
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
export class ApartmentRoutingModule { }
