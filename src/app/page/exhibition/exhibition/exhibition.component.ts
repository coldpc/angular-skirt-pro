import { Component, OnInit } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";

@Component({
  selector: 'sk-cars',
  templateUrl: './exhibition.component.html',
  styleUrls: ['./exhibition.component.scss']
})
export class ExhibitionComponent implements OnInit {

  isLoading = false;

  currentIndex = 1;

  constructor(private routerService: RouterService) {

  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
  }

  onTapBack() {
    this.routerService.gotoBack();
  }

  switchTab(index) {
    if (this.currentIndex !== index) {
      this.currentIndex = index;
      window.scrollTo(0, 0);
    }
  }
}
