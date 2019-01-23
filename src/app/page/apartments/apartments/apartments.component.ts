import {Component, OnInit, OnDestroy} from '@angular/core';
import {ApiApartmentListService, InApartmentModel} from "../../../lib/service/http/api/ApiApartmentListService";
import {EnTagSize} from 'src/app/lib/enums/EnTagSize';
import {InCityModel} from "../../../lib/interfaces/InCityModel";
import {CityPageBase} from "../../../components/select-city/CityPageBase";
import {RouterService} from "../../../lib/service/router/RouterService";

@Component({
  selector: 'sk-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.scss']
})
export class ApartmentsComponent implements OnInit {

  apartments: Array<InApartmentModel> = [];

  EnTagSize = EnTagSize;

  isShowSelectCity: boolean = false;

  currentCity: InCityModel = CityPageBase.getCacheCity();

  constructor(private apiApartmentListService: ApiApartmentListService,
              private routerService: RouterService) {
    console.log(this.routerService.queryParams);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    let cityId = this.currentCity.cityId || '';
    this.apiApartmentListService
      .setBody({cityId})
      .showLoading()
      .request(this.onLoadData.bind(this));
  }

  onLoadData(res: InApartmentModel[]): void {
    this.apartments = res;
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

  onTapCity(): void {
    this.isShowSelectCity = true;
  }

  OnSwitchCity(city: InCityModel): void {
    this.currentCity = city;
    this.loadData();
  }
}
