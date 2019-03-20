import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {state, trigger, style, animate, transition} from '@angular/animations';
import {DynamicCore} from "../../../components/dynamicCore/DynamicCore";
import {SkEasyScroller} from "../../../lib/utils/ZScroller/SkEasyScroller";
import {DomSanitizer, SafeHtml} from '_@angular_platform-browser@7.1.4@@angular/platform-browser';

@Component({
  selector: 'sk-article-viewer',
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

  private _richData: any = {};
  @Input()
  set richData(obj) {
    this._richData = obj;
    this.richHtml = this.getSecurityHtml((obj || {text: ''}).text);
  }

  get richData() {
    return this._richData;
  }

  richHtml: SafeHtml = "";

  zScroller: any = null;
  @ViewChild("scroll") scrollRef;

  constructor(private sanitizer: DomSanitizer) {
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

  getSecurityHtml(text) {
    if (text) {
      return this.sanitizer.bypassSecurityTrustHtml(this.pxToRem(text));
    }
  }

  pxToRem(str) {
    // 匹配:20px或: 20px不区分大小写
    let reg = /(\d)+(px)/gi;
    let arr = str.match(reg);
    for (let i = 0, len = arr.length; i < len; i++) {
      str = str.replace(arr[i], parseInt(arr[i], 10) / 100 + 'rem');
    }
    return str;
  }


  stop(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }
}
