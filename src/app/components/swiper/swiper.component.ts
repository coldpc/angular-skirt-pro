import {
  AfterContentInit,
  AfterViewInit, Component, ContentChildren, ElementRef, Input, OnDestroy, QueryList, ViewChild
} from '@angular/core';
import {SwiperSlideComponent} from "./swiper-slide/swiper-slide.component";

@Component({
  selector: 'sk-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss']
})
export class SwiperComponent implements AfterViewInit, AfterContentInit, OnDestroy {
  plugin: any;

  @ViewChild("wrapper") wrapper: ElementRef;
  @ContentChildren(SwiperSlideComponent) sliders: QueryList<SwiperSlideComponent>;

  @Input() isAuto: boolean = true;
  @Input() isLoop: boolean = true;
  @Input() times: number = 900; // 切换的时间
  @Input() duration: number = 6000; // 切换的间隔

  _active = 1;
  @Input()
  set activeIndex(index: number) {
    this._active = index;
  }

  get activeIndex(): number {
    return this._active;
  }

  constructor() {
  }

  ngAfterViewInit () {
    this.sliders.changes.subscribe(() => {
      this.reCreate();
    });
  }

  ngAfterContentInit() {
    this.update();
  }

  ngOnDestroy() {
    this.destroy();
  }

  update() {
    if (!this.plugin) {
      this.createSlider();
    }else {
      this.update();
    }
  }


  // 重新创建
  reCreate() {
    this.destroy();
    this.createSlider();
  }

  createSlider() {
    // 变态的插件 initialSlide从0开始
    // 事件改变从1开始
    this.initEvent(this.plugin = new Swiper(this.wrapper.nativeElement, {
      speed: 400,
      loop: this.isLoop,
      initialSlide: this.activeIndex - 1,
      autoplay: this.isAuto ? {
        delay: this.duration
      } : false
    }));

  }

  initEvent(swiper: any) {
    swiper.on('slideChange', () => {
      this.setActive(this.plugin.activeIndex);
    });
  }

  getPluginInstance() {
    return this.plugin;
  }

  getClass(index: number): string {
    if (this._active === index + 1) {
      return 'active';
    }else {
      return '';
    }
  }

  onTapSign(index: number): void {
    if (this.activeIndex !== index) {
      this.slideTo(index);
    }
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
    this.getPluginInstance().slideTo(index);
  }

  destroy() {
    if (this.plugin) {
      this.getPluginInstance().destroy(true, true);
    }
  }
}
