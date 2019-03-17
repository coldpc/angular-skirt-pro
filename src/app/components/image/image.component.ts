import {Component, OnInit, Input} from '@angular/core';
import {InCoverPictures} from "../../lib/interfaces/InCoverPictures";
import {EnCoverPictureType} from "../../lib/enums/EnCoverPictureType";
import {UrlApi} from "../../lib/utils/UrlApi";

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

  // oss图片压缩的宽度
  @Input() processWidth: number = 1;
  // oss的图片压缩的质量
  @Input() processQuality: number = 80;

  public imgSrc: string;

  public isComplete = false;

  /**
   * 处理阿里云图片
   * @param remoteUrl 地址
   * @param width 宽度
   * @param quality 质量
   */
  static processImageUrl(remoteUrl, width, quality = 80) {
    let host = 'aliyuncs.com';
    let prefix = 'x-oss-process=image';

    // 阿里云图片并且未处理过
    if (remoteUrl && remoteUrl.indexOf(host) > -1 && remoteUrl.indexOf(prefix) === -1) {
      remoteUrl = remoteUrl + "?" + prefix;

      // 有可能是比例
      // 限制128的倍数，防止oss的种类太多
      // 种类太多 容易造成cdn节点的克隆镜像过多
      // 浪费公司财力
      if (width < 2) {
        let screenWidth = window.screen.width * (window.devicePixelRatio || 1);
        width = 128 * Math.ceil(width * screenWidth / 128);
      }

      // 生成新的url
      remoteUrl = `${remoteUrl}/resize,w_${width}/auto-orient,1/quality,Q_${quality}`;
    }

    return remoteUrl;
  }

  ngOnInit() {
  }

  getSrc(): string {
    let src = this.src || (this.pictures && this.pictures[this.pictureType]);
    if (src) {
      src = ImageComponent.processImageUrl(src, this.processWidth, this.processQuality);
    }
    return src;
  }

  getStyle(): any {
    let src = this.getSrc();
    if (src) {
      return {
        backgroundImage: `url(${src})`
      };
    }
  }

  /**
   * 加载完成需要把背景icon去掉
   */
  onLoadImage() {
    this.isComplete = true;
  }
}
