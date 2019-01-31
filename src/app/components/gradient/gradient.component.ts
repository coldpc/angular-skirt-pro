import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {RemView} from "../../RemView";

@Component({
  selector: 'sk-gradient',
  templateUrl: './gradient.component.html',
  styleUrls: ['./gradient.component.scss'],
  host: {
    '[class.gradient-area]': 'isGradientArea'
  }
})
export class GradientComponent implements OnInit, OnDestroy {

  // 距离顶部的距离多少 触发渐变
  @Input() distance: number = 80 * RemView.scale;
  @Input() scrollTarget: HTMLElement | Window = window;

  public isGradientArea: boolean = false;

  private onScrollBind;

  constructor() { }

  ngOnInit() {
    this.onScrollBind = this.onScroll.bind(this);
    this.scrollTarget.addEventListener('scroll', this.onScrollBind);
  }

  ngOnDestroy() {
    this.scrollTarget.removeEventListener('scroll', this.onScrollBind);
  }

  onScroll() {
    let scrollTop, scrollTarget = this.scrollTarget;

    if (scrollTarget === window) {
      scrollTop = scrollTarget.document.documentElement.scrollTop
                  || scrollTarget.pageYOffset
                  || scrollTarget.document.body.scrollTop
                  || 0;
    } else {
      scrollTop = scrollTarget.scrollTo;
    }

    this.isGradientArea = scrollTop > this.distance;
  }
}
