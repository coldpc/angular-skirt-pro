import { Component, OnInit } from '@angular/core';
import {GetApartmentDetailService} from "../../../lib/service/http/api/GetApartmentDetailService";
import {RouterService} from "../../../lib/service/router/RouterService";
import {InApartmentModel} from "../../../lib/service/http/api/ApiApartmentListService";
import {EnTagSize} from 'src/app/lib/enums/EnTagSize';

@Component({
  selector: 'sk-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss']
})
export class ApartmentComponent implements OnInit {

  isLoading = false;

  EnTagSize = EnTagSize;

  apartmentDetail: InApartmentModel;

  constructor(private getApartmentDetailService: GetApartmentDetailService,
              private routerService: RouterService) {

  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.getApartmentDetailService
      .setBody(this.routerService.queryParams.apartmentId)
      .showLoading()
      .request((data) => {
        this.onLoadData(data);
      }, null, () => {
        this.isLoading = false;
      });
  }

  onLoadData(data) {
    this.apartmentDetail = data;
  }

  onTapBack() {
    this.routerService.gotoBack();
  }

}
