import {UtilsBase} from "./UtilsBase";

export class UrlApi {
  static addParams(url: string, params: any): string {
    let temp, keys;

    keys = Object.keys(params || {});
    for (let key of keys) {
      temp = params[key];
      if (!UtilsBase.isNull(temp)) {
        url += `${url.indexOf("?") === -1 ? '?' : '&'}${key}=${encodeURIComponent(temp)}`;
      }
    }
    return url;
  }
}
