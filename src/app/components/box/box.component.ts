import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  @Input() ratio: number = 1;

  style: any = {};

  constructor() { }

  ngOnInit() {
    this.style.paddingBottom = `${Math.round(10000 / this.ratio) * 100}%`;
  }

}
