import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DynamicCore} from "../dynamicCore/DynamicCore";
import {state, trigger, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'sk-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('anim', [
      state('active', style({
        opacity: 1,
        transform: 'scale3d(1, 1, 1) translateY(0%)'
      })),
      state('inactive', style({
        display: 'none',
        opacity: 0,
        transform: 'scale3d(1, 1, 1) translateY(100%)'
      })),
      transition('inactive => active', animate('250ms ease-out')),
      transition('active => inactive', animate('250ms ease-in'))
    ])
  ]
})
export class ModalComponent extends DynamicCore implements OnInit {

  @Input() title: string;
  @Input() hasConfirm: boolean = true;

  @Output() confirmEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit() {
  }

  onTapClose() {
    super.hide();
  }

  onTapConfirm() {
    super.hide();
    this.confirmEvent.emit();
  }
}
