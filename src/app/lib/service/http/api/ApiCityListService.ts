import {Injectable, Injector} from '@angular/core';
import {ApiCoreService} from "../ApiCoreService";
import { InCityModel } from '../../../interfaces/InCityModel';

@Injectable()
export class ApiCityListService extends ApiCoreService<Array<InCityModel>> {

  // 请求路径
  public path = '/product/index/get-city-list';

  constructor(private injector: Injector) {
    super(injector);
    super.setPath(this.path);
  }
}
