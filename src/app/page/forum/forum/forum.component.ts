import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import {RouterService} from "../../../lib/service/router/RouterService";
import {ApiStationListService} from 'src/app/lib/service/http/api/ApiStationListService';
import {ApiStationImgListService} from "../../../lib/service/http/api/ApiStationImgListService";
import {SwiperComponent} from "../../../components/swiper/swiper.component";
import {SkEasyScroller} from "../../../lib/utils/ZScroller/SkEasyScroller";

@Component({
  selector: 'sk-cars',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit, AfterViewInit {

  isLoading = false;

  currentIndex = 1;

  allWidth = "1000px";
  sIndex = 0;

  isShowSelect = false;
  stationList = [];
  selectedStation = null;
  stationImgList = [];
  isShowRealImgBtn = true;
  isShowBeforeBtn = true;
  isShowPrevBtn = true;

  // 预览图片地址
  viewImgSrc = '';

  // 预览图片id
  viewImgId = '';

  // 预览图片索引
  viewImgIndex = 0;

  @ViewChildren("video") videoList: QueryList<ElementRef>;
  @ViewChild("swiper") swiperRef: SwiperComponent;
  @ViewChild("mediaList") mediaListRef: ElementRef;
  scroll;

  pics = [
    {url: "/assets/img/vipjizhan/bg.jpg", video: "/assets/video/v1.mp4"},
  ];
  // pics = [{url: "/assets/img/vipjizhan/bg.jpg", video: "/assets/textures/movie.mp4"}, {url: "/assets/img/vipjizhan/bg.jpg"}];

  constructor(private routerService: RouterService,
              private apiStationImgListService: ApiStationImgListService,
              private apiStationListService: ApiStationListService) {

  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {

  }

  onTapStation() {
    this.isShowSelect = true;
  }

  loadData() {
    this.apiStationListService.request((res) => {
      // console.log(res);
      this.stationList = res;

      this.allWidth = res.length * 9 / 10 + "rem";

      if (!this.selectedStation) {
        this.loadImgList(res[0]);
      }
    });

  }

  loadImgList(station) {
    if (this.selectedStation !== station) {
      this.selectedStation = station;
      this.apiStationImgListService.setParams({stationId: station.id}).request((res) => {
        this.stationImgList = [];

        for (let i=0; i<res.length; i++){
          this.stationImgList.push({
            index: i,
            id: res[i].id,
            url: res[i].url + "?x-oss-process=image/resize,w_512"
          })
        }
      });
    }
  }

  // 查看原图
  checkReal () {
    // 获取当前压缩之后的图片地址
    let realIme = this.viewImgSrc;

    // 截取？之前的字符串
    let index = realIme.indexOf("?");
    realIme = realIme.slice(0, index);

    this.viewImgSrc = realIme;

    this.isShowRealImgBtn = false;
  }

  onChangeCity(e, i) {
    console.log(e, i);

    this.sIndex = i;
    this.loadImgList(e);
  }

  onChangeSelect(e) {
    this.loadImgList(e);
  }

  onTapBack() {
    this.routerService.gotoBack();
  }

  switchTab(index) {
    if (this.currentIndex !== index) {
      this.currentIndex = index;
      window.scrollTo(0, 0);
    }
  }

  nextVideo() {
    this.swiperRef.slideNext();
    this.pauseVideo();
  }

  preVideo() {
    this.swiperRef.slidePrev();
    this.pauseVideo();
  }

  onViewImg(imgItem) {
    this.isShowRealImgBtn = true;
    this.isShowBeforeBtn = true;
    this.isShowPrevBtn = true;
    this.viewImgSrc = imgItem.url;
    this.viewImgId = imgItem.id;
    this.viewImgIndex = imgItem.index;
    if (this.viewImgIndex == 0) {
      this.isShowBeforeBtn = false;
    }

    if (this.viewImgIndex == this.stationImgList.length - 1) {
      this.isShowPrevBtn = false;
    }
  }

  onTapCloseViewImg() {
    this.viewImgSrc = '';
  }

  playVideo(index) {
    let videoList = this.videoList.toArray();
    let video = videoList[index].nativeElement;
    video.play();
  }

  onPlayVideo(pic) {
    pic.hasPlay = true;
  }

  onPause(pic) {
    pic.hasPlay = false;
  }

  pauseVideo() {
    let videoList = this.videoList.toArray(), video;
    for (let i = 0; i < videoList.length; i++) {
      video = videoList[i].nativeElement;
      if (!video.paused) {
        video.pause();
      }
    }
  }

  /**
   * 预览图切换
   */
  // 上一张
  tapBefore () {
    if (this.viewImgIndex >= 0) {
      this.viewImgSrc = this.stationImgList[this.viewImgIndex -= 1].url;
      this.isShowRealImgBtn = true;
      this.isShowPrevBtn = true;
      this.isShowBeforeBtn = true;
    }

    if (this.viewImgIndex == 0) {
      this.isShowBeforeBtn = false;
    }
  }

  // 下一张
  tapPrev () {
    if (this.viewImgIndex <= this.stationImgList.length) {
      this.viewImgSrc = this.stationImgList[this.viewImgIndex += 1].url;
      this.isShowRealImgBtn = true;
      this.isShowBeforeBtn = true;
      this.isShowPrevBtn = true;
    }

    if (this.viewImgIndex == this.stationImgList.length - 1) {
      this.isShowPrevBtn = false;
    }
  }
}