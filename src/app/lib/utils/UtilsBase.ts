interface InClientInfo {
  width: number;
  height: number;
  isIos: boolean;
  isAndroid: boolean;
  isPhone: boolean;
  isPc: boolean;
  isWx: boolean;
}

export class UtilsBase {

  static isNull(v): boolean {
    return !v && v !== 0;
  }

  static numberToString(value): string {
    if (!isNaN(value) && typeof value === 'number') {
      return value + '';
    } else {
      return value;
    }
  }

  // 判断字符串是否为数字
  // 判断正整数 /^[1-9]+[0-9]*]*$/
  static isNumber(v): boolean {
    let re = /^[0-9]+.?[0-9]*$/;
    return re.test(v);
  }


  /**
   * 判断是否全等为true
   * 1 === '1' | 1 === 1
   * @param v1 值1
   * @param v2 值2
   */
  static checkIsEqual(v1, v2): boolean {
    v1 = UtilsBase.numberToString(v1);
    v2 = UtilsBase.numberToString(v2);
    return v1 === v2;
  }

  /**
   * 检查是否为数字
   * @param value 值
   */
  static checkIsNumber(value): boolean {
    return UtilsBase.checkIsEqual(parseFloat(value), value);
  }

  /**
   * 深度拷贝
   * @param data 拷贝的数据
   */
  static deepCopy(data): any {
    if (!data || typeof data !== "object") {
      return data;
    } else {
      let result;
      if (data instanceof Array) {
        result = [];
      } else {
        result = [];
      }

      for (let key of Object.keys(data)) {
        result[key] = this.deepCopy(data[key]);
      }
      return result;
    }
  }

  /*
    ** randomWord 产生任意长度随机字母数字组合
    ** randomFlag-是否任意长度
    * min-任意长度最小位[固定位数]
    * max-任意长度最大位
    */
  static createRandomStr(strLength = 18): string {
    let str = "", pos;
    let arr = ['0', '1', '2', '3', '4', '5', '6', '7',
      '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
      'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
      'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
      'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    for (let i = 0; i < strLength; i++) {
      pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  }

  /**
   * 检测客户端机型和环境
   */
  static getClient(): InClientInfo {
    const WEI_XIN_APP_SIGN = 'microMessenger';
    let userAgent;
    const result: InClientInfo = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      isPc: true,
      isPhone: false,
      isWx: false,
      isIos: false,
      isAndroid: false
    };

    userAgent = window.navigator.userAgent.toLowerCase();

    // 判断是否为微信
    if (userAgent.indexOf(WEI_XIN_APP_SIGN.toLocaleLowerCase()) > -1) {
      result.isWx = true;
    }

    // 判断系统
    if (userAgent.indexOf('android') > -1 || userAgent.indexOf('linux') > -1) {
      // 安卓手机
      result.isAndroid = true;
      result.isPc = false;
      result.isPhone = true;
    } else if (userAgent.indexOf('iphone') > -1) {
      // 苹果手机
      result.isIos = true;
      result.isPc = false;
      result.isPhone = true;
    }
    return result;
  }
}
