import {Injectable, Injector} from '@angular/core';
import {ApiCoreService} from "../ApiCoreService";

@Injectable()
export class ApiDistributorsService extends ApiCoreService<Array<any>> {

  // 请求路径
  public path = '/appointmentDistributor/queryDistributorsByCity';

  constructor(private injector: Injector) {
    super(injector);
    super.setPath(this.path);
  }
}


// http://api8080.ximuok.com/appointmentDistributor/queryDistributorsByCity?city=上海&province=上海
