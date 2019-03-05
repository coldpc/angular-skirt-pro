import {UtilsBase} from "./UtilsBase";

export class DateApi {
  /**
   * 转化为日期
   */
  static toDate(value) {
    let date;
    if (UtilsBase.checkIsNumber(value)) {
      date = new Date(parseInt(value, 10));
    } else if (typeof value === 'string') {
      // 需要处理兼容ios
      value = value.replace(/-/gi, "/");
      date = new Date(value);
    } else {
      date = value;
    }
    return date;
  }

  /**
   *
   * @param date 日期 number/date/string
   * @param fmt 格式 yyyy-MM-dd hh:mm:ss
   */
  static formatDate(date, fmt = "yyyy-MM-dd hh:mm:ss") {
    if (!date) {
      return date;
    }

    date = DateApi.toDate(date);

    if (!fmt) {
      fmt = "yyyy-MM-dd hh:mm:ss";
    }

    let o = {
      "M+": date.getMonth() + 1, // 月份
      "d+": date.getDate(), // 日
      "h+": date.getHours(), // 小时
      "m+": date.getMinutes(), // 分
      "s+": date.getSeconds(), // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      "S": date.getMilliseconds() // 毫秒
    };

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }

    return fmt;
  }
}
