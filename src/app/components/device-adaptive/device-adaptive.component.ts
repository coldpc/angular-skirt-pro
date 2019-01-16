import { Component, OnInit, Input } from '@angular/core';
import {EnDeviceAdaptiveType} from "../../lib/enums/EnDeviceAdaptiveType";

interface InSystemDeviceInfo {
  topBarHeight: number;
  bottomHeight: number;
}

@Component({
  selector: 'sk-device-adaptive',
  templateUrl: './device-adaptive.component.html',
  styleUrls: ['./device-adaptive.component.scss']
})
export class DeviceAdaptiveComponent implements OnInit {

  // 适配设备的背景色
  @Input() color: string = 'transparent';

  // 适配的类型 默认不适配
  @Input() type: EnDeviceAdaptiveType = EnDeviceAdaptiveType.none;

  style = {
    paddingTop: '0',
    paddingBottom: '0'
  };

  constructor() { }

  ngOnInit() {
    let systemDeviceInfo = this.setSystemInfo();

    if (this.type === EnDeviceAdaptiveType.top && systemDeviceInfo.topBarHeight) { // 顶部适配
      this.style.paddingTop = systemDeviceInfo.topBarHeight + 'px';

    } else if (this.type === EnDeviceAdaptiveType.bottom && systemDeviceInfo.bottomHeight) { // 底部适配
      this.style.paddingBottom = systemDeviceInfo.bottomHeight + 'px';
    }
  }

  setSystemInfo(): InSystemDeviceInfo {
    return {
      topBarHeight: 0,
      bottomHeight: 0
    };
  }
}
