import {
  AfterContentInit,
  AfterViewInit, Component, ContentChildren, ElementRef, Input, OnDestroy, QueryList, ViewChild
} from '@angular/core';
import {SwiperSlideComponent} from "./swiper-slide/swiper-slide.component";
import {LoadJs} from "../../lib/utils/LoadJs";

@Component({
  selector: 'sk-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss']
})
export class SwiperComponent implements AfterViewInit, AfterContentInit, OnDestroy {
  @ViewChild("container") container: ElementRef;
  @ContentChildren(SwiperSlideComponent) sliders: QueryList<SwiperSlideComponent>;

  @Input() isAuto: boolean = true;
  @Input() isLoop: boolean = true;
  @Input() speed: number = 500; // 切换的时间
  @Input() duration: number = 6000; // 切换的间隔

  // swiper实例
  private plugin: any;

  // 当前定焦的index
  private _active = 1;

  constructor() {
  }

  @Input()
  set activeIndex(index: number) {
    this._active = index;
  }

  get activeIndex(): number {
    return this._active;
  }

  ngAfterViewInit () {}

  ngAfterContentInit() {
    this.update();
  }

  ngOnDestroy() {
    this.destroy();
  }

  async loadSwiper(): Promise<any> {
    if (typeof window['Swiper'] === "undefined") {
      await LoadJs("/assets/swiper/swiper.custom.min.js");
    }
    return window['Swiper'];
  }

  update() {
    if (!this.plugin) {
      this.createSwiper().then(() => {
        this.initEvent(this.plugin);
      }).catch();
    }
  }

  async createSwiper() {
    let Swiper = await this.loadSwiper();

    this.plugin = new Swiper(this.container.nativeElement, {
      speed: this.speed,
      loop: this.isLoop,
      initialSlide: this.activeIndex - 1,
      autoplay: this.isAuto ? this.duration : 0
    });
  }

  initEvent(swiper: any) {
    swiper.on('slideChange', () => {
      this.setActive(this.plugin.activeIndex);
    });
  }

  setActive(index: number) {
    let num = this.sliders.length;

    if (index > num) {
      index = 1;
    } else if (index < 1) {
      index = num;
    }

    this._active = index;
  }

  // 激活某个tab
  slideTo(index: number) {
    this.plugin.slideTo(index);
  }

  destroy() {
    if (this.plugin) {
      this.plugin.destroy(true, true);
    }
  }
}
