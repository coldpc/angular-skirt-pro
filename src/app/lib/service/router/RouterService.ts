import {Injectable} from "@angular/core";
import {RouterCoreService} from "./RouterCoreService";
import {EnRouterPath} from "../../enums/EnRouterPath";
import {InCityModel} from "../../interfaces/InCityModel";
import {InRouterPath} from "../../interfaces/InRouterPath";
import {EnHistoryState} from "../../enums/EnHistoryState";

@Injectable()
export class RouterService extends RouterCoreService {

  /**
   * 公寓列表
   */
  gotoApartments(params: ApartmentsParams = {}): void {
    params.path = EnRouterPath.apartments;
    this.loadPage(params);
  }

  /**
   * 门店详情
   */
  gotoApartment(apartmentId, historyState: EnHistoryState = EnHistoryState.push): void {
    let params = {
      path: EnRouterPath.store,
      params: {
        apartmentId
      },
      historyState
    };
    this.loadPage(params);
  }
}

// 约定取公寓列表的参数
interface ApartmentsParams extends InRouterPath {
  params ?: InCityModel;
}

