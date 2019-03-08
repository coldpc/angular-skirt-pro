import { Component, OnInit, AfterViewInit } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";

@Component({
  selector: 'sk-cars',
  templateUrl: './zhanlan.component.html',
  styleUrls: ['./zhanlan.component.scss']
})
export class ZhanlanComponent implements OnInit, AfterViewInit {

  isLoading = false;

  currentIndex = 1;

  isShowImg = false;

  showB1 = false;
  showB2 = false;
  showB3 = false;
  showB4 = false;
  showB5 = true;


  constructor(private routerService: RouterService) {

  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showB1 = true;
    }, 1000);

    setTimeout(() => {
      this.showB2 = true;
    }, 1600);

    setTimeout(() => {
      this.showB3 = true;
    }, 2600);

    setTimeout(() => {
      this.showB4 = true;
    }, 3400);
  }

  loadData() {
  }

  onTap(index) {
    this.currentIndex = index;
    this.isShowImg = true;
  }
}
