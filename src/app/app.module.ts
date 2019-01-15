import { BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {DialogComponent} from "./components/dialog/dialog.component";
import {ListComponent} from "./components/list/list.component";
import {ModalComponent} from "./components/modal/modal.component";


/*********************需要使用收拾识别************************/
/**设置Hammer.defaults.touchAction 保证touch不会停止冒泡*/

import 'hammerjs';
declare var Hammer: any;
Hammer.defaults.touchAction = "auto";
/**********************************************************/

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    ListComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
