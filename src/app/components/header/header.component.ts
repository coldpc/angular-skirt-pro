import { Component, OnInit, Input } from '@angular/core';

declare var window: any;

@Component({
  selector: 'sk-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title: string = "标题";
  @Input() hasBack: boolean = false;
  @Input() isBackAction: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  onTapLeft() {
    if (this.isBackAction) {
      window.history.back();
    }
  }
}
