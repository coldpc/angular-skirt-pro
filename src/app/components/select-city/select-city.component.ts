import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DynamicCore} from "../dynamicCore/DynamicCore";
import {ApiCityListService} from "../../lib/service/http/api/ApiCityListService";
import {InCityModel} from "../../lib/interfaces/InCityModel";
import {CityPageBase, COUNTRY_DEFAULT_CITY, LIVE_DEFAULT_CITY} from "./CityPageBase";
import {state, trigger, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'sk-select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss'],
  animations: [
    trigger('anim', [
      state('active', style({
        opacity: 1,
        transform: 'scale3d(1, 1, 1) translateY(0%)'
      })),
      state('inactive', style({
        display: 'none',
        opacity: 0.8,
        transform: 'scale3d(1, 1, 1) translateY(-100%)'
      })),
      transition('inactive => active', animate('250ms ease-in')),
      transition('active => inactive', animate('250ms ease-out'))
    ])
  ]
})
export class SelectCityComponent extends DynamicCore implements OnInit {
  cityList: InCityModel[] = [COUNTRY_DEFAULT_CITY];

  @Input() currentCity: InCityModel = CityPageBase.getCacheCity();
  @Output() currentCityChange: EventEmitter<InCityModel> = new EventEmitter();

  constructor(private apiCityListService: ApiCityListService) {
    super();
  }

  ngOnInit() {
    this.apiCityListService.request(this.onLoadCityData.bind(this));
  }

  onLoadCityData(list: InCityModel[]) {
    list.unshift(COUNTRY_DEFAULT_CITY);
    this.cityList = list;
  }

  onTapClose() {
    super.hide();
  }

  onTapCity(city) {
    if (city.cityId !== this.currentCity.cityId) {
      this.currentCity = city;
      this.currentCityChange.emit(city);
      CityPageBase.saveCity(city);
      super.hide();
    }
  }
}
