import { Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {SkDynamicComponentService} from "./components/dynamic-component-factory/sk-dynamic-component.service";
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import {AudioService} from "./lib/service/system/audio.service";

@Component({
  selector: 'sk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'angular7-skirt-pro';


  loadingDom = window.document.getElementById("app_loading_id");

  @ViewChild("audio") audioRef: ElementRef;

  constructor(private dynamicService: SkDynamicComponentService,
              private audioService: AudioService,
              private router: Router) {

    this.setRouteState();

  }

  ngAfterViewInit(): void {
    this.audioService.audioRef = this.audioRef;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  setRouteState() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        if (this.loadingDom) {
          this.loadingDom.parentNode.removeChild(this.loadingDom);
          this.loadingDom = null;
        }
        // 每次路由跳转改变状态
        // this.routerState = !this.routerState;
        // // this.routerStateCode = this.routerState ? 'active' : 'inactive';
        //
        // let historyState = this.pageControllerBase.historyState;
        // historyState = historyState ? (historyState + '-') : '';
        //
        // this.routerStateCode = historyState + (this.routerState ? 'active' : 'inactive');
        // this.pageControllerBase.historyState = '';
      }
    });
  }
}
