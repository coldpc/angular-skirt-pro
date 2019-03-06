import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {state, trigger, style, animate, transition} from '@angular/animations';
import {DynamicCore} from "../../../components/dynamicCore/DynamicCore";
import {SkEasyScroller} from "../../../lib/utils/ZScroller/SkEasyScroller";

@Component({
  selector: 'sk-img-viewer',
  templateUrl: './img-viewer.component.html',
  styleUrls: ['./img-viewer.component.scss'],
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
export class ImgViewerComponent extends DynamicCore implements OnInit {

  @Input() currentIndex: number = 1;


  zScroller: any = null;
  @ViewChild("scroll") scrollRef;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  onTapClose() {
    super.hide();
  }

  animationDone(e) {
    // 没数据或者已经创建过
    if (!this.zScroller) {

      let zScroller = this.zScroller = new SkEasyScroller(this.scrollRef.nativeElement, {
        scrollingX: false
      });
    } else {
      this.zScroller.reflow();
    }
  }


  stop(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }
}
