import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sk-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input() ratio: number;
  @Input() src: string;

  constructor() { }

  ngOnInit() {
  }

}
