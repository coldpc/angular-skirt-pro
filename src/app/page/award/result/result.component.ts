import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {state, trigger, style, animate, transition} from '@angular/animations';
import {DynamicCore} from "../../../components/dynamicCore/DynamicCore";

@Component({
  selector: 'sk-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  animations: [
    trigger('anim', [
      state('active', style({
        opacity: 1,
        transform: 'scale3d(1, 1, 1) translateY(0%)'
      })),
      state('void', style({
        opacity: 0,
        transform: 'scale3d(0.5, 0.5, 0.5) translateY(70%)'
      })),
      state('inactive', style({
        display: 'none',
        opacity: 0,
        transform: 'scale3d(0.5, 0.5, 0.5) translateY(70%)'
      })),
      transition('inactive => active', animate('250ms ease-out')),
      transition('void => active', animate('250ms ease-out')),
      transition('active => inactive', animate('250ms ease-in'))
    ])
  ]
})
export class ResultComponent extends DynamicCore implements OnInit {

  @Input() hasAward: boolean = false;
  @Input() awardData: {
    awardValue ?: string;
    createTime ?: string;
    name ?: string;
    mobile ?: string;
  } = {};

  isShowShare: boolean = false;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  onTapClose() {
    super.hide();
  }

  stop(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }

  onTapShare() {
    this.isShowShare = true;
    this.hide();
  }
}
