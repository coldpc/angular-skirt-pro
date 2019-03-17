import { Component, OnInit } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";

@Component({
  selector: 'sk-cars',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  isLoading = false;

  currentIndex = 1;

  pics = [{url: "/assets/img/vipjizhan/bg.jpg"}, {url: "/assets/img/vipjizhan/bg.jpg"}];

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
