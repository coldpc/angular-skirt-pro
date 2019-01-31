/*********************需要使用收拾识别************************/
/**设置Hammer.defaults.touchAction 保证touch不会停止冒泡*/
import 'hammerjs';
declare var Hammer: any;
Hammer.defaults.touchAction = "auto";

/************************设置rem视图**********************************/
import {RemView} from './RemView';
RemView.init(375, 1);

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SkDynamicComponentService} from "./components/dynamic-component-factory/sk-dynamic-component.service";
import {AddHostDirective} from './lib/directives/add-host.directive';
import {ApiCoreService} from "./lib/service/http/ApiCoreService";
import {SystemModule} from "./lib/modules/system.module";
import {DialogService} from "./lib/service/system/dialog.service";
import {DialogComponent} from "./components/dialog/dialog.component";
import {LoadingService} from "./lib/service/system/loading.service";
import {LoadingComponent} from "./components/loading/loading.component";
import {httpInterceptorProviders} from "./lib/service/http/http-interceptors";

// app根节点需要提供的服务
let providers = [
  SkDynamicComponentService,
  ApiCoreService,
  DialogService,
  LoadingService,
  httpInterceptorProviders
];

@NgModule({
  declarations: [
    AppComponent,
    AddHostDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SystemModule
  ],
  providers: [
    ...providers
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent, LoadingComponent]
})
export class AppModule {
}
