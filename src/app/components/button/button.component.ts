import {Component, Input, OnInit} from '@angular/core';
import {EnButtonColor, EnButtonSize} from "../../lib/enums/Button";
import {EnDeviceAdaptiveType} from "../../lib/enums/EnDeviceAdaptiveType";

@Component({
  selector: 'sk-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() adaptType: EnDeviceAdaptiveType = EnDeviceAdaptiveType.none;
  @Input() type: EnButtonColor = EnButtonColor.default;
  @Input() size: EnButtonSize = EnButtonSize.default;

  innerClass = '';
  constructor() { }

  ngOnInit() {
  }

  onHover() {
    this.innerClass = 'hover';
  }

  onEnd() {
    this.innerClass = '';
  }
}
