import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {RouterCoreService} from "../../lib/service/router/RouterCoreService";

declare var window: any;

@Component({
  selector: 'sk-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [RouterCoreService]
})
export class HeaderComponent implements OnInit {

  @Input() title: string = '';

  // 是否有返回的icon
  @Input() hasBack: boolean = false;

  // 返回的icon是否默认具有返回的动作
  @Input() isBackAction: boolean = true;

  // 输出的事件
  @Output() tapLeft: EventEmitter<Event> = new EventEmitter();
  @Output() tapRight: EventEmitter<Event> = new EventEmitter();

  constructor(private routerCoreService: RouterCoreService) { }

  ngOnInit() {
  }

  onTapLeft(e: Event) {
    if (this.hasBack && this.isBackAction) {
      this.routerCoreService.gotoBack();
    } else {
      this.tapLeft.emit(e);
    }
  }

  onTapRight(e: Event) {
    this.tapRight.emit(e);
  }


}
