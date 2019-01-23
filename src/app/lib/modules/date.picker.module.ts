import { NgModule } from '@angular/core';
import {CommonComponentsModule} from "./common.components.module";
import {DatePickerComponent} from "../../components/date-picker/date-picker.component";
import {PickerModule} from "./picker.module";

// 系统加载的内容
const components = [
  DatePickerComponent
];

// 服务供应列表
const providers = [];

@NgModule({
  declarations: [...components],
  imports: [CommonComponentsModule, PickerModule],
  exports: [...components],
  providers: [...providers],
  entryComponents: []
})
export class DatePickerModule { }
