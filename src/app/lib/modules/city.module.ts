import { NgModule } from '@angular/core';
import {SelectCityComponent} from "../../components/select-city/select-city.component";
import {CommonComponentsModule} from "./common.components.module";

// 系统加载的内容
const components = [
  SelectCityComponent
];

// 服务供应列表
const providers = [

];

@NgModule({
  declarations: [...components],
  imports: [CommonComponentsModule],
  exports: [...components],
  providers: [...providers],
  entryComponents: []
})
export class SystemModule { }
