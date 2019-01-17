import { BrowserModule} from '@angular/platform-browser';

/*********************需要使用收拾识别************************/
/**设置Hammer.defaults.touchAction 保证touch不会停止冒泡*/

import 'hammerjs';
declare var Hammer: any;
Hammer.defaults.touchAction = "auto";

/************************设置rem视图**********************************/
import {RemView} from './RemView';
RemView.init(375, 1);

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SkDynamicComponentService} from "./components/dynamic-component-factory/sk-dynamic-component.service";
import { AddHostDirective } from './lib/directives/add-host.directive';
import {HttpClientCore} from "./lib/service/http/HttpClientCore";
import {SystemModule} from "./lib/modules/system.module";
import {DialogService} from "./lib/service/system/dialog.service";
import {DialogComponent} from "./components/dialog/dialog.component";


let providers = [
  SkDynamicComponentService,
  HttpClientCore,
  DialogService
];

@NgModule({
  declarations: [
    AppComponent,
    AddHostDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SystemModule
  ],
  providers: [
    ...providers
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule { }
