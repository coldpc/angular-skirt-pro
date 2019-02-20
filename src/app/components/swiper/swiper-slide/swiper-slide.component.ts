import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sk-swiper-slide',
  templateUrl: './swiper-slide.component.html',
  styleUrls: ['./swiper-slide.component.scss'],
  host: {
    '[class.swiper-slide]': 'true'
  }
})
export class SwiperSlideComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
