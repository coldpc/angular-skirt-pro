import { Component, OnInit } from '@angular/core';
import {GetApartmentDetailService} from "../../../lib/service/http/api/GetApartmentDetailService";
import {RouterService} from "../../../lib/service/router/RouterService";
import {InApartmentModel} from "../../../lib/service/http/api/ApiApartmentListService";
import {EnTagSize} from 'src/app/lib/enums/EnTagSize';
import {EnButtonSize} from 'src/app/lib/enums/EnButtonSize';
import {EnButtonType} from "../../../lib/enums/EnButtonType";

@Component({
  selector: 'sk-jinrongjie',
  templateUrl: './jinrongjie.component.html',
  styleUrls: ['./jinrongjie.component.scss']
})
export class JinrongjieComponent implements OnInit {

  isLoading = false;

  EnTagSize = EnTagSize;

  EnButtonSize = EnButtonSize;
  EnButtonType = EnButtonType;

  apartmentDetail: InApartmentModel;

  constructor(private getApartmentDetailService: GetApartmentDetailService,
              private routerService: RouterService) {

  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // this.getApartmentDetailService
    //   .setBody(this.routerService.queryParams.apartmentId)
    //   .showLoading()
    //   .request((data) => {
    //     this.onLoadData(data);
    //   }, null, () => {
    //     this.isLoading = false;
    //   });
  }

  onLoadData(data) {
    this.apartmentDetail = data;
  }

  onTapBack() {
    this.routerService.gotoBack();
  }

}
