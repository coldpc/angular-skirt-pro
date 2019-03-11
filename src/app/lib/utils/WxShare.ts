import {ApiWxShareService, InWxConfig} from "../service/http/api/ApiWxShareService";
import {LoadJs} from "./LoadJs";
import {Injectable} from '@angular/core';

export interface InShareData {
  title?: string;
  desc?: string;
  link?: string;
  imgUrl ?: string;
}

@Injectable()
export class WxShareService {
  appId = 'wxa3ca844a8780edbd';
  config: InShareData;
  constructor(private apiWxShareService: ApiWxShareService) {
  }

  async getConfig(config: InShareData) {
    let location = window.location;
    this.config = config;

    config.imgUrl = config.imgUrl || (location.protocol + '//' + location.host + '/assets/img/share-default.jpg');
    config.link = config.link || (location.protocol + '//' + location.host + "/");
    config.title = config.title || "雷凌星球";
    config.desc = config.desc || "广汽丰田雷凌星球全新启航";

    // 加载js
    if (!window['wx']) {
      await LoadJs("http://res.wx.qq.com/open/js/jweixin-1.4.0.js");
    }

    // 加载微信分享
    this.apiWxShareService.setBody({
      path: window.location.href
    }).request((data: InWxConfig) => {
      this.initWxConfig(data);
    });
  }

  initWxConfig(data: InWxConfig) {
    let wx = window['wx'];
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: this.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature, // 必填，签名
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',

        // 1.4.0 即将废弃的 API，但是仅使用上面的API设置，安卓无效
        // 所以还是需要用一下
        'onMenuShareAppMessage',
        'onMenuShareTimeline'
      ] // 必填，需要使用的JS接口列表
    });

    this.listenerReady();
  }

  // config信息验证后会执行ready方法，
  // 所有接口调用都必须在config接口获得结果之后，
  // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
  // 则须把相关接口放在ready函数中调用来确保正确执行。
  // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
  listenerReady() {
    let config = this.config;
    let wx = window['wx'];

    wx.ready(() => {
      // 1.4.0 新接口 (只调用这个接口在安卓下是无效的)
      if (typeof wx.updateAppMessageShareData === 'function') {
        wx.updateAppMessageShareData(config);
      }

      if (typeof wx.updateTimelineShareData === 'function') {
        wx.updateTimelineShareData(config);
      }

      if (typeof wx.onMenuShareAppMessage === 'function') {
        // 1.2.0 老接口
        wx.onMenuShareAppMessage(config);
      }

      if (typeof wx.onMenuShareTimeline === 'function') {
        wx.onMenuShareTimeline(config);
      }
    });
  }
}
