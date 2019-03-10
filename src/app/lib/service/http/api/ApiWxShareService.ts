import {Injectable, Injector} from '@angular/core';
import {ApiCoreService} from "../ApiCoreService";
export interface InWxConfig {
  url: string,
  signature: string,
  nonceStr: string,
  timestamp: string
}

@Injectable()
export class ApiWxShareService extends ApiCoreService<InWxConfig> {

  // 请求路径
  public path = '/weChat/wxShare';

  constructor(private injector: Injector) {
    super(injector);
    super.setPath(this.path);
  }
}
