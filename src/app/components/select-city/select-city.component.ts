import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DynamicCore} from "../dynamicCore/DynamicCore";
import {ApiCityListService} from "../../lib/service/http/api/ApiCityListService";
import {InCityModel} from "../../lib/interfaces/InCityModel";
import {CityPageBase} from "./CityPageBase";

@Component({
  selector: 'sk-select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss']
})
export class SelectCityComponent extends DynamicCore implements OnInit {
  cityList: InCityModel[] = [];

  @Input() currentCity: InCityModel = CityPageBase.getCacheCity();
  @Output() currentCityChange: EventEmitter<InCityModel> = new EventEmitter();

  constructor(private apiCityListService: ApiCityListService) {
    super();
  }

  ngOnInit() {
    this.apiCityListService.request(this.onLoadCityData.bind(this));
  }

  onLoadCityData(list: InCityModel[]) {
    this.cityList = list;
  }
}
