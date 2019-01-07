import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sk-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title: string = "标题";
  @Input() hasBack: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
