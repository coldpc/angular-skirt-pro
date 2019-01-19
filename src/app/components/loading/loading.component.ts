import { Component, OnInit } from '@angular/core';
import {DynamicCore} from "../dynamicCore/DynamicCore";
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'sk-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [
    trigger('anim', [
      state('active', style({
        opacity: 1,
        transform: 'scale3d(1, 1, 1)'
      })),
      state('inactive', style({
        display: 'none',
        opacity: 0,
        transform: 'scale3d(0.6, 0.5, 1)'
      })),
      transition('inactive => active', animate('250ms ease-out')),
      transition('active => inactive', animate('250ms ease-in'))
    ])
  ]
})
export class LoadingComponent extends DynamicCore implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
