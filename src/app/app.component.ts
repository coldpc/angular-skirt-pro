import { Component, AfterViewInit} from '@angular/core';
import {SkDynamicComponentService} from "./components/dynamic-component-factory/sk-dynamic-component.service";

@Component({
  selector: 'sk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'angular7-skirt-pro';

  constructor(private dynamicService: SkDynamicComponentService) {

  }

  ngAfterViewInit(): void {
  }
}
