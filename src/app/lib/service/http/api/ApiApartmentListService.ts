import {Injectable, Injector} from '@angular/core';
import {ApiCoreService} from "../ApiCoreService";

export interface InApartmentModel {
  addressLine: string;
  apartmentDesc: string;
  apartmentId: string;
  apartmentName: string;
  apartmentPhoneNo: string;
  cbdDesc: string;
  coverPictures: string;
  district: string;
  focusPoi: string;
  geoPosition: string;
  headPicUrl: string;
  isFull: number;
  isReserved: number;
  labels: Array<{name: string, value: number}>;
  managerName: string;
  pics: Array<any>;
  priceLow: number;
}

@Injectable()
export class ApiApartmentListService extends ApiCoreService<Array<InApartmentModel>> {
  public path = '/product/apartment/get-apartment-list';

  constructor(private injector: Injector) {
    super(injector);
    super.setPath(this.path);
  }
}
