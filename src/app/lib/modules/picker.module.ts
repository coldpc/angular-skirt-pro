import { NgModule } from '@angular/core';
import {CommonComponentsModule} from "./common.components.module";
import {PickerComponent} from "../../components/picker/picker.component";

// 系统加载的内容
const components = [
  PickerComponent
];

// 服务供应列表
const providers = [];

@NgModule({
  declarations: [...components],
  imports: [CommonComponentsModule],
  exports: [...components],
  providers: [...providers],
  entryComponents: []
})
export class PickerModule { }
