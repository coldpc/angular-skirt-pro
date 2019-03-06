import { Component, OnInit } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";

@Component({
  selector: 'sk-cars',
  templateUrl: './zhanlan.component.html',
  styleUrls: ['./zhanlan.component.scss']
})
export class ZhanlanComponent implements OnInit {

  isLoading = false;

  currentIndex = 1;

  isShowImg = false;

  constructor(private routerService: RouterService) {

  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
  }

  onTap(index) {
    this.currentIndex = index;
    this.isShowImg = true;
  }
}
