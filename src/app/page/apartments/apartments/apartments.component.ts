import { Component, OnInit } from '@angular/core';
import {ApiApartmentListService, InApartmentModel} from "../../../lib/service/http/api/ApiApartmentListService";

@Component({
  selector: 'sk-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.scss']
})
export class ApartmentsComponent implements OnInit {

  apartments: Array<InApartmentModel>;

  constructor(private apiApartmentListService: ApiApartmentListService) {
    apiApartmentListService.subscribe((res) => {
      this.onLoadData(res);
    });
  }

  ngOnInit() {
    this.apiApartmentListService.showLoading().request();
  }

  onLoadData(res: Array<InApartmentModel>) {
    this.apartments = res;
  }

  getPoi(distance) {
    return Math.round(distance / 1000);
  }
}
