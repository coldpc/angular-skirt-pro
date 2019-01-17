import { BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

/*********************需要使用收拾识别************************/
/**设置Hammer.defaults.touchAction 保证touch不会停止冒泡*/

import 'hammerjs';
declare var Hammer: any;
Hammer.defaults.touchAction = "auto";

/************************设置rem视图**********************************/
import {RemView} from './RemView';
RemView.init(375, 1);

import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ListComponent} from "./components/list/list.component";
import {ModalComponent} from "./components/modal/modal.component";
import {SkDynamicComponentService} from "./components/dynamic-component-factory/sk-dynamic-component.service";
import { AddHostDirective } from './lib/directives/add-host.directive';
import {DialogService} from "./lib/service/system/dialog.service";
import {DialogComponent} from "./components/dialog/dialog.component";
import {CommonComponentsModule} from "./components/common.components.module";


let providers = [
  SkDynamicComponentService,
  DialogService
];

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ModalComponent,
    AddHostDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    CommonComponentsModule
  ],
  providers: [
    ...providers
  ],
  bootstrap: [AppComponent],
  entryComponents:[DialogComponent]
})
export class AppModule { }
