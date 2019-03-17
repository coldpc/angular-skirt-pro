import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {SkEasyScroller} from "../../../lib/utils/ZScroller/SkEasyScroller";

@Component({
  selector: 'sk-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit, AfterViewInit {

  scroll: SkEasyScroller;
  richScroll: SkEasyScroller;

  snapWidth;

  mediaListData = ["/assets/img/forum/p3-meiti.png", "/assets/img/forum/p3-meiti.png", "/assets/img/forum/p3-meiti.png"];

  currentMediaIndex = 0;

  @ViewChild("mediaList") mediaListRef: ElementRef;
  @ViewChild("richScroll") richScrollRef: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initScroll();
  }

  initScroll() {
    this.scroll = new SkEasyScroller(this.mediaListRef.nativeElement, {
      scrollingX: true,
      scrollingY: false,
      snapping: true, // 滚动结束之后 滑动对应的位置
      scrollingComplete: this.onScrollComplete.bind(this),
      onScroll: this.onScroll.bind(this)
    });

    this.snapWidth = this.mediaListRef.nativeElement.children[0].offsetWidth;
    this.scroll.scroller.setSnapSize(this.snapWidth, 0);


    this.richScroll = new SkEasyScroller(this.richScrollRef.nativeElement, {
      scrollingX: false
    });
  }

  onScrollComplete() {

  }

  onScroll(x, y) {
    let selectedIndex = Math.round(x / this.snapWidth) || 0;
    if (selectedIndex !== this.currentMediaIndex) {
      this.currentMediaIndex = selectedIndex;
    }
  }

  getScaleStyle(distance) {
    distance = Math.abs(distance);

    let scale = 1 - distance * 0.2;
    let opacity = 1 - distance * 0.3;
    opacity = opacity > 0.1 ? opacity : 0.1;

    return {
      transform: `scale(${scale}, ${scale})`,
      opacity
    };
  }

  onTapMedia(index) {
    setTimeout(() => {
      this.currentMediaIndex = index;
      this.scroll.scroller.scrollTo(this.snapWidth * index, 0, true);
    }, 100);
  }

  prevMedia(change) {
    this.onTapMedia(this.currentMediaIndex + change);
  }
}
