import {Component, Input, OnInit} from '@angular/core';
import {EnButtonColor, EnButtonSize} from "../../lib/enums/Button";

@Component({
  selector: 'sk-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() type: EnButtonColor = EnButtonColor.default;
  @Input() size: EnButtonSize = EnButtonSize.default;
  constructor() { }

  ngOnInit() {
  }

}
