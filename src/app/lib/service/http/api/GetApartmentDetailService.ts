import {Injectable, Injector} from '@angular/core';
import {ApiCoreService} from "../ApiCoreService";
import {InApartmentModel} from "./ApiApartmentListService";

@Injectable()
export class GetApartmentDetailService extends ApiCoreService<InApartmentModel> {

  // 请求路径
  public path = '/product/apartment/get-apartment-detail';

  constructor(private injector: Injector) {
    super(injector);
    super.setPath(this.path);
  }

  setBody(apartmentId: string): ApiCoreService<InApartmentModel> {
    return super.setBody({
      apartmentId
    });
  }
}
