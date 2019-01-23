import {Injectable} from "@angular/core";
import {RouterCoreService} from "./RouterCoreService";
import {EnRouterPath} from "../../enums/EnRouterPath";
import {InCityModel} from "../../interfaces/InCityModel";
import {InRouterPath} from "../../interfaces/InRouterPath";

@Injectable()
export class RouterService extends RouterCoreService {

  /**
   * 公寓列表
   */
  gotoApartments(params ?: ApartmentsParams): void {
    params.path = EnRouterPath.apartments;
    this.loadPage(params);
  }
}


interface ApartmentsParams extends InRouterPath {
  params ?: InCityModel;
}
