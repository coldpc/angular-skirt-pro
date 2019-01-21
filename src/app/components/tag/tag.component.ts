import { Component, OnInit, Input } from '@angular/core';
import {EnTagSize} from "../../lib/enums/EnTagSize";

@Component({
  selector: 'sk-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() size: EnTagSize = EnTagSize.normal;
  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

}
