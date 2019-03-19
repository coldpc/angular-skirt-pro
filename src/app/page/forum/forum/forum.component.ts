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

  // 预览图片地址
  viewImgSrc = '';

  @ViewChildren("video") videoList: QueryList<ElementRef>;
  @ViewChild("swiper") swiperRef: SwiperComponent;
  @ViewChild("mediaList") mediaListRef: ElementRef;
  scroll;

  pics = [
    {url: "/assets/img/vipjizhan/bg.jpg", video: "/assets/video/v1.mp4"},
    {url: "/assets/img/vipjizhan/bg.jpg", video: "/assets/video/v2.mp4"}
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
      console.log(res);
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
        this.stationImgList = res;
        console.log(res);
      });
    }

  }

  onChangeCity(e, i) {
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
  }

  preVideo() {
    this.swiperRef.slidePrev();
  }

  onViewImg(imgItem) {
    this.viewImgSrc = imgItem.url;
  }

  onTapCloseViewImg() {
    this.viewImgSrc = '';
  }

  playVideo(index) {
    let videoList = this.videoList.toArray();
    let video = videoList[index].nativeElement;
    video.play();
  }
}
