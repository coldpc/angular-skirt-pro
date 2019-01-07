import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sk-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  @Input() ratio: number = 1;
  @Input() backgroundImage: string;

  style: any = {};

  constructor() { }

  ngOnInit() {
    this.style.paddingBottom = `${Math.round(10000 / this.ratio) / 100}%`;
  }

  getBackground() {
    return {
      backgroundImage: `url(${this.backgroundImage})`
    };
  }
}
