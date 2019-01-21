import {Component, OnInit, OnDestroy} from '@angular/core';
import {ApiApartmentListService, InApartmentModel} from "../../../lib/service/http/api/ApiApartmentListService";
import {EnTagSize} from 'src/app/lib/enums/EnTagSize';

@Component({
  selector: 'sk-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.scss']
})
export class ApartmentsComponent implements OnInit, OnDestroy {

  apartments: Array<InApartmentModel> = [];

  EnTagSize = EnTagSize;

  constructor(private apiApartmentListService: ApiApartmentListService) {
  }

  ngOnInit() {
    this.apiApartmentListService
      .showLoading()
      .request(this.onLoadData.bind(this));
  }

  onLoadData(res: InApartmentModel[]): void {
    this.apartments = res;
  }

  getPoi(distance) {
    return Math.round(distance / 1000);
  }

  getPoiName(apartment) {
    if (apartment.focusPoi) {
      return apartment.focusPoi.poiName || '';
    }
  }

  getPoiPosition(apartment) {
    if (apartment.focusPoi) {
      let distance = apartment.focusPoi.distance || 0;
      if (distance < 1000) {
        return distance + 'm';
      } else {
        return Math.round((apartment.focusPoi.distance || 0) / 1000) + 'km';
      }
    }
  }

  ngOnDestroy(): void {
    // this.apiApartmentListService.observers.splice(0);
    // this.apiApartmentListService.unsubscribe();
  }
}
