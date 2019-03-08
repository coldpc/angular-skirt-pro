import {Injectable, Injector} from '@angular/core';
import {ApiCoreService} from "../ApiCoreService";

@Injectable()
export class ApiLotteryGetService extends ApiCoreService<Array<any>> {

  // 请求路径
  public path = '/lottery/get';

  constructor(private injector: Injector) {
    super(injector);
    super.setPath(this.path);
  }
}
