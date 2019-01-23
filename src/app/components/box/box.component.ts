import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sk-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
  host : {
    '[style.padding-bottom]' : 'paddingBottom'
  }
})
export class BoxComponent implements OnInit {

  @Input() ratio: number = 1;
  @Input() backgroundImage: string;

  paddingBottom: string = '0';

  constructor() { }

  ngOnInit() {
    this.paddingBottom = `${Math.round(10000 / this.ratio) / 100}%`;
  }
}
