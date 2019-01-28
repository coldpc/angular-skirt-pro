import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {DynamicCore} from "../dynamicCore/DynamicCore";


enum EnMaskState {
  hide = 'inactive',
  show = 'active'
}

@Component({
  selector: 'sk-mask',
  templateUrl: './mask.component.html',
  styleUrls: ['./mask.component.scss'],
  animations: [
    trigger('ctrlMask', [
      state('active', style({
        opacity: 1,
      })),
      state('inactive', style({
        opacity: 0.1,
        display: "none"
      })),
      state('void', style({
        opacity: 0.1,
        display: "none"
      })),
      transition('void => active', animate('250ms ease-out')),
      transition('active <=> inactive', animate('250ms ease-out'))
    ])
  ]
})
export class MaskComponent extends DynamicCore implements OnInit {
  // 点击背景是否隐藏
  @Input() isTapBackHide = true;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  public onTap(): void {
    if (this.isTapBackHide) {
      super.hide();
    }
  }

  public onTouchMove(event: TouchEvent): void {
    if (event.cancelable) {
      event.preventDefault();
    }
  }
}
