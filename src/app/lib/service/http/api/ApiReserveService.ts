import {Injectable, Injector} from '@angular/core';
import {ApiCoreService} from "../ApiCoreService";

@Injectable()
export class ApiReserveService extends ApiCoreService<Array<any>> {

  // 请求路径
  public path = '/appointmentInfo/save';

  constructor(private injector: Injector) {
    super(injector);
    super.setPath(this.path);
  }
}
