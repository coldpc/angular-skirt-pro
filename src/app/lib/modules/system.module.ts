import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogComponent} from "../../components/dialog/dialog.component";
import {MaskComponent} from "../../components/mask/mask.component";
import {TouchHoverDirective} from "../directives/touch-hover.directive";
import {LoadingComponent} from "../../components/loading/loading.component";

// 系统加载的内容
const components = [
  MaskComponent,
  DialogComponent,
  LoadingComponent,
  TouchHoverDirective
];

// 服务供应列表
const providers = [

];

@NgModule({
  declarations: [...components],
  imports: [CommonModule],
  exports: [...components, CommonModule],
  providers: [...providers],
  entryComponents: [DialogComponent]
})
export class SystemModule { }
