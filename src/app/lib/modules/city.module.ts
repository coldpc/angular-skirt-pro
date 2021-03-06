import { NgModule } from '@angular/core';
import {SelectCityComponent} from "../../components/select-city/select-city.component";
import {CommonComponentsModule} from "./common.components.module";
import {ApiCityListService} from "../service/http/api/ApiCityListService";
import {InnerScrollModule} from "./inner-scroll.module";

// 系统加载的内容
const components = [
  SelectCityComponent
];

// 服务供应列表
const providers = [
  ApiCityListService
];

@NgModule({
  declarations: [...components],
  imports: [CommonComponentsModule, InnerScrollModule],
  exports: [...components],
  providers: [...providers],
  entryComponents: []
})
export class CityModule { }
