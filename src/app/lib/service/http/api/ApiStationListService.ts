import {Injectable, Injector} from '@angular/core';
import {ApiCoreService} from "../ApiCoreService";
import {EnRequestMethod} from "../../../enums/EnRequestMethod";

@Injectable()
export class ApiStationListService extends ApiCoreService<Array<any>> {

  // 请求路径
  public path = '/station/getList';

  constructor(private injector: Injector) {
    super(injector);
    super.setPath(this.path);

    this.method = EnRequestMethod.get;
  }
}
