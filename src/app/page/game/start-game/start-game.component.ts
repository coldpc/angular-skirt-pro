import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {state, trigger, style, animate, transition} from '@angular/animations';
import {DynamicCore} from "../../../components/dynamicCore/DynamicCore";

@Component({
  selector: 'sk-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
  animations: [
    trigger('anim', [
      state('active', style({
        opacity: 1,
        transform: 'scale3d(1, 1, 1) translateY(-50%)'
      })),
      state('void', style({
        opacity: 0,
        transform: 'scale3d(0.5, 0.5, 0.5) translateY(50%)'
      })),
      state('inactive', style({
        display: 'none',
        opacity: 0,
        transform: 'scale3d(0.5, 0.5, 0.5) translateY(50%)'
      })),
      transition('inactive => active', animate('250ms ease-out')),
      transition('void => active', animate('250ms ease-out')),
      transition('active => inactive', animate('250ms ease-in'))
    ])
  ]
})
export class StartGameComponent extends DynamicCore implements OnInit {

  @Output() startEvent: EventEmitter<null> = new EventEmitter();
  constructor() {
    super();
  }

  ngOnInit() {
  }

  stop(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }

  start() {
    this.hide();
    this.startEvent.emit();
  }
}
