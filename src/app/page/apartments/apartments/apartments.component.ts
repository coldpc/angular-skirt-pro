import {Component, OnInit, OnDestroy} from '@angular/core';
import {ApiApartmentListService, InApartmentModel} from "../../../lib/service/http/api/ApiApartmentListService";

@Component({
  selector: 'sk-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.scss']
})
export class ApartmentsComponent implements OnInit, OnDestroy {

  apartments: Array<InApartmentModel>;

  constructor(private apiApartmentListService: ApiApartmentListService) {
  }

  ngOnInit() {
    this.apiApartmentListService
      .showLoading()
      .request()
      .subscribe((res: InApartmentModel[]) => {
        this.onLoadData(res);
      });
  }

  onLoadData(res: InApartmentModel[]): void {
    this.apartments = res;
  }

  getPoi(distance) {
    return Math.round(distance / 1000);
  }

  ngOnDestroy(): void {
    // this.apiApartmentListService.observers.splice(0);
    // this.apiApartmentListService.unsubscribe();
  }
}
