import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var window: any;

@Component({
  selector: 'sk-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title: string = "";
  @Input() hasBack: boolean = false;
  @Input() isBackAction: boolean = true;

  // 输出的事件
  @Output() tapLeft: EventEmitter<Event> = new EventEmitter();
  @Output() tapRight: EventEmitter<Event> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onTapLeft(e: Event) {
    if (this.isBackAction) {
      window.history.back();
    } else {
      this.tapLeft.emit(e);
    }
  }

  onTapRight(e: Event) {
    this.tapRight.emit(e);
  }
}
