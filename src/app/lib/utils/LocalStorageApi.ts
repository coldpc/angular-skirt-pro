import {UtilsBase} from "./UtilsBase";

export class LocalStorageApi {

  /**
   * 移除本地缓存项
   * @param key 缓存key'
   * @returns 返回是否移除成功
   */
  static removeItem(key): boolean {
    let localStorage = window.localStorage;
    if (localStorage) {
      localStorage.removeItem(key);
      return true;
    } else {
      return false;
    }
  }

  /**
   * 加入缓存项
   * @param key 键
   * @param value 值
   */
  static setItem(key, value): void {
    let localStorage = window.localStorage;

    if (localStorage) {
      if (typeof value !== "object") {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  }

  /**
   * 获取存储项
   * @param key 键
   * @param isAutoParse 是否自动格式化
   */
  static getItem(key, isAutoParse): any {
    let data = window.localStorage.getItem(key);
    if (!UtilsBase.isNull(data) && isAutoParse) {
      data = JSON.parse(data);
    }
    return data;
  }
}
