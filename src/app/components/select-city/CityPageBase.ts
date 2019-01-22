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

  static getRootDomain() {
    let domainArray = window.location.hostname.split('.');
    let domain = domainArray.pop();
    return `.${domainArray.pop()}.${domain}`;
  }

  // 获取缓存中的city
  static getCacheCity(): {cityName: string, cityId: string} {
    let city = CookieApi.getCookie(LIVE_CITY_LOC_KEY, true);
    if (!city || (!city.cityName && !city.cityName)) {
      city = LIVE_DEFAULT_CITY;
    }
    return city;
  }
}
