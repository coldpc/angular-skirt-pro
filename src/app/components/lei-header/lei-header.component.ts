import { Component, OnInit, Input } from '@angular/core';
import {RouterService} from "../../lib/service/router/RouterService";
import {AudioService} from "../../lib/service/system/audio.service";

@Component({
  selector: 'sk-lei-header',
  templateUrl: './lei-header.component.html',
  styleUrls: ['./lei-header.component.scss']
})
export class LeiHeaderComponent implements OnInit {

  @Input() hasBack = true;
  @Input() isScale = false;

  constructor(private routeService: RouterService,
              public audioService: AudioService) { }

  ngOnInit() {
  }

  onTapBack() {
    this.routeService.gotoBack();
  }

  toggleMusic() {
    this.audioService.toggle();
  }
}
