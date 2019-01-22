import { NgModule } from '@angular/core';
import {CommonComponentsModule} from "./common.components.module";
import {ApiCityListService} from "../service/http/api/ApiCityListService";
import {InnerScrollComponent} from "../../components/inner-scroll/inner-scroll.component";

// 系统加载的内容
const components = [
  InnerScrollComponent
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
export class InnerScrollModule { }
