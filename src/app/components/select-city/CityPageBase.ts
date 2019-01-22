import CookieApi from "../../lib/utils/CookieApi";
import {InCityModel} from "../../lib/interfaces/InCityModel";

// 城市存储的键
const LIVE_CITY_LOC_KEY = 'live_city_loc_key';

// 默认城市
const LIVE_DEFAULT_CITY: InCityModel = {
  cityName: '上海',
  cityId: 3101
};

export class CityPageBase {

  // 获取顶级域名
  static getRootDomain(): string {
    let domainArray = window.location.hostname.split('.');
    let domain = domainArray.pop();
    return `.${domainArray.pop()}.${domain}`;
  }

  // 获取缓存中的city
  static getCacheCity(): InCityModel {
    return CookieApi.getCookie(LIVE_CITY_LOC_KEY, true) || LIVE_DEFAULT_CITY;
  }
}
