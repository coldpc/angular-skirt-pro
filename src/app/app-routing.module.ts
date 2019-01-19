import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '',
    redirectTo: 'page/home',
    pathMatch: 'full'
  },
  {
    path: 'page/home',
    loadChildren: './page/home/home.module#HomeModule',
    canLoad: []
  },
  {
    path: 'page/apartments',
    loadChildren: './page/apartments/apartments.module#ApartmentsModule',
    canLoad: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
