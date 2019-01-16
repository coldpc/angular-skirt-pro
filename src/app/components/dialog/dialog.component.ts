import {Component, OnInit, ViewChild, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {DynamicCore} from "../dynamicCore/DynamicCore";

@Component({
  selector: 'sk-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  animations: [
    trigger('anim', [
      state("void", style({
        opacity: 0,
        transform: 'scale3d(0.5, 0.5, 1) translate(-50%, -50%)'
      })),
      state('active', style({
        opacity: 1,
        transform: 'scale3d(1, 1, 1) translate(-50%, -50%)'
      })),
      state('inactive', style({
        opacity: 0,
        transform: 'scale3d(0.5, 0.5, 1) translate(-50%, -50%)'
      })),
      transition('* <=> *', animate('200ms ease-out'))
    ])
  ]
})
export class DialogComponent extends DynamicCore implements OnInit {
  @Input() message: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {

  }

  onTapCancel() {
    this.hide();
  }

  onTapOk() {
    this.hide();
  }
}

