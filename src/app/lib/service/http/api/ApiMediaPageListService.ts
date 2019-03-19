import {Injectable, Injector} from '@angular/core';
import {ApiCoreService} from "../ApiCoreService";
import {EnRequestMethod} from "../../../enums/EnRequestMethod";

@Injectable()
export class ApiMediaPageListService extends ApiCoreService<any> {

  // 请求路径
  public path = '/media/text/getPage';

  constructor(private injector: Injector) {
    super(injector);
    super.setPath(this.path);
    this.method = EnRequestMethod.get;
  }
}
