import { Component, OnInit, Input } from '@angular/core';
import {InCoverPictures} from "../../lib/interfaces/InCoverPictures";
import {EnCoverPictureType} from "../../lib/enums/EnCoverPictureType";

@Component({
  selector: 'sk-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  // 图片比例
  @Input() ratio: number;

  // src
  @Input() src: string;

  // 区分分辨率的图片
  @Input() pictures: InCoverPictures;

  @Input() pictureType: EnCoverPictureType = EnCoverPictureType.medium;


  constructor() { }

  ngOnInit() {
  }

  getStyle(): any {
    let src = this.src || (this.pictures && this.pictures[this.pictureType]);
    if (src) {
      return {
        backgroundImage: `url(${src})`
      };
    }
  }
}
