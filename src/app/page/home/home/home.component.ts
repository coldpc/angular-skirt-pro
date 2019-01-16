import { Component, OnInit } from '@angular/core';
import {EnButtonType} from "../../../lib/enums/Button";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imgSrc = "/assets/test.jpg";
  isShowMask = false;

  buttonType: any = EnButtonType;

  constructor() { }

  ngOnInit() {
  }

  onTapImg() {
    this.isShowMask = true;
  }

  onTapButton() {
    this.isShowMask = true;
  }
}
