import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sk-cool-menu',
  templateUrl: './cool-menu.component.html',
  styleUrls: ['./cool-menu.component.scss']
})
export class CoolMenuComponent implements OnInit {

  @Input() text: string;
  constructor() { }

  ngOnInit() {
  }

}
