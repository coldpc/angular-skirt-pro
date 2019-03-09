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
  },
  {
    path: 'page/apartment',
    loadChildren: './page/apartment/apartment.module#ApartmentModule',
    canLoad: []
  },
  {
    path: 'page/cars',
    loadChildren: './page/cars/cars.module#CarsModule',
    canLoad: []
  },
  {
    path: 'page/jinrongjie',
    loadChildren: './page/jinrongjie/jinrongjie.module#JinrongjieModule',
    canLoad: []
  },
  {
    path: 'page/reserve',
    loadChildren: './page/reserve/reserve.module#ReserveModule',
    canLoad: []
  },
  {
    path: 'page/carPrice',
    loadChildren: './page/carPrice/car-price.module#CarPriceModule',
    canLoad: []
  },
  {
    path: 'page/exhibition',
    loadChildren: './page/exhibition/exhibition.module#ExhibitionModule',
    canLoad: []
  },
  {
    path: 'page/zhanlan',
    loadChildren: './page/zhanlan/zhanlan.module#ZhanlanModule',
    canLoad: []
  },
  {
    path: 'page/award',
    loadChildren: './page/award/award.module#AwardModule',
    canLoad: []
  },
  {
    path: 'page/forum',
    loadChildren: './page/forum/forum.module#ForumModule',
    canLoad: []
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
