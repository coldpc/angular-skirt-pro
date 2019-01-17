import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {DynamicCore} from "../dynamicCore/DynamicCore";

@Component({
  selector: 'sk-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  animations: [
    trigger('anim', [
      state('active', style({
        opacity: 1,
        transform: 'scale3d(1, 1, 1) translate(-50%, -50%)'
      })),
      state('inactive', style({
        display: 'none',
        opacity: 0,
        transform: 'scale3d(0.6, 0.5, 1) translate(-50%, -50%)'
      })),
      transition('inactive => active', animate('250ms ease-out')),
      transition('active => inactive', animate('250ms ease-in'))
    ])
  ]
})
export class DialogComponent extends DynamicCore implements OnInit {
  @Input() message: string = '';
  @Input() okText: string = '确定';
  @Input() cancelText: string = '取消';
  @Input() isConfirm: boolean = false;
  @Input() data: any;

  // 点击确定和取消分别抛出的事件
  @Output() okEvent: EventEmitter<any> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {

  }

  onTapCancel() {
    this.cancelEvent.emit(this.data);
    this.hide();
  }

  onTapOk() {
    this.okEvent.emit(this.data);
    super.hide();
  }
}

