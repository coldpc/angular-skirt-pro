import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {state, trigger, style, animate, transition} from '@angular/animations';
import {DynamicCore} from "../../../components/dynamicCore/DynamicCore";
import {SkEasyScroller} from "../../../lib/utils/ZScroller/SkEasyScroller";

@Component({
  selector: 'sk-protocol',
  templateUrl: './protocol.component.html',
  styleUrls: ['./protocol.component.scss'],
  animations: [
    trigger('anim', [
      state('active', style({
        opacity: 1,
        transform: 'scale3d(1, 1, 1) translateY(0%)'
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
export class ProtocolComponent extends DynamicCore implements OnInit {

  @Input() title: string;
  @Input() hasConfirm: boolean = true;

  @Output() confirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() animationStartEvent: EventEmitter<AnimationEvent> = new EventEmitter();
  @Output() animalDoneEvent: EventEmitter<AnimationEvent> = new EventEmitter();


  barStyle = {
    transform: 'translateY(0)'
  };


  zScroller: any = null;
  @ViewChild("scroll") scrollRef;

  @ViewChild("lineBar") lineBarRef;

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
        scrollingX: false,
        scrollingComplete: this.onScrollComplete.bind(this),
        onScroll: this.onScroll.bind(this)
      });
    }
  }

  onScrollComplete(left, top, zoom) {

  }

  onScroll(left, top, zoom) {
    let dy = 0, translateY, isTop = true;

    let totalHeight = this.scrollRef.nativeElement.offsetHeight;
    let barHeight = this.lineBarRef.nativeElement.offsetHeight;
    let lineHeight = this.lineBarRef.nativeElement.children[0].offsetHeight;

    let scrollMax = totalHeight - barHeight;

    // 计算translate
    translateY = ((barHeight - lineHeight) * top / scrollMax);

    this.barStyle.transform = `translateY(${translateY}px)`;
  }

  onTouchMove(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }

}
