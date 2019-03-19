import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {SkEasyScroller} from "../../../lib/utils/ZScroller/SkEasyScroller";
import {ApiMediaListService} from "../../../lib/service/http/api/ApiMediaListService";
import {ApiMediaPageListService} from "../../../lib/service/http/api/ApiMediaPageListService";

@Component({
  selector: 'sk-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit, AfterViewInit {

  scroll: SkEasyScroller;
  richScroll: SkEasyScroller;

  snapWidth;

  mediaListData = [];

  currentMediaIndex = 0;

  isShow = false;
  richData: {
    text ?: string,
    title ?: string,
    headPic ?: string
  } = {};

  @ViewChild("mediaList") mediaListRef: ElementRef;
  @ViewChild("richScroll") richScrollRef: ElementRef;

  constructor(private mediaListService: ApiMediaListService,
              protected pageService: ApiMediaPageListService) { }

  ngOnInit() {
    this.mediaListService.request((res) => {
      console.log(res);
      this.mediaListData = res;
      this.loadMediaPage(res[0].id);
    });
  }

  ngAfterViewInit(): void {
    this.initScroll();
  }

  loadMediaPage(mediaId) {
    this.pageService.setParams({
      offset: 10,
      limit: 1,
      createTimeDesc: 'true',
      mediaId
    }).request((res) => {
      console.log(res);
      if (res.records && res.records.length > 0) {
        this.richData = res.records[0];
      } else {
        this.richData = {};
      }
    });
  }

  initScroll() {
    this.scroll = new SkEasyScroller(this.mediaListRef.nativeElement, {
      scrollingX: true,
      scrollingY: false,
      snapping: true, // 滚动结束之后 滑动对应的位置
      scrollingComplete: this.onScrollComplete.bind(this),
      onScroll: this.onScroll.bind(this)
    });

    this.snapWidth = 1.1 * parseInt(window.document.documentElement.style.fontSize, 10);
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
      this.changeMedia(index);
      this.scroll.scroller.scrollTo(this.snapWidth * index, 0, true);
    }, 100);
  }

  onTapShare() {
    this.isShow = true;
    console.log(1111);
  }

  prevMedia(change) {
    this.onTapMedia(this.currentMediaIndex + change);
  }

  changeMedia(index) {
    if (this.currentMediaIndex !== index) {
      this.currentMediaIndex = index;
      this.loadMediaPage(this.mediaListData[index].id);
    }
  }
}
