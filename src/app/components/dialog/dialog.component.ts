import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

/**
 *
 * message
 * show 方法调用
 * config: {
 *    type 类型: default: message; confirm,
 *    title: 标题 default: 提示
 *    content: 文本文字
 *    btnGroup: default: ['确定','取消'];
 *    ok: Function
 *    cancel: Function
 * }
 * **/
@Component({
  selector: 'sk-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  animations: [
    trigger('msgState', [
      state('show', style({
        top: '48%',
        opacity: 1
      })),
      transition('void => show', [
        style({top: '58%', opacity: 0}),
        animate('0.3s cubic-bezier(0.46, 0.03, 0.52, 0.96)')
      ]),
      transition('show => void', [
        animate('0.3s cubic-bezier(0.46, 0.03, 0.52, 0.96)', style({top: '58%', opacity: 0}))
      ])
    ])
  ]
})
export class DialogComponent implements OnInit {
  constructor() {

  }

  ngOnInit() {}
}

