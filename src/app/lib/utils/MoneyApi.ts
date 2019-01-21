export class MoneyApi {

  /**
   * 格式化金钱 0.00
   * @param value
   * @param nullText
   * @returns {string}
   */
  static format(value: string|number, nullText = '-') {
    let v: number = parseFloat(value + '');

    // 不存在合法值得情况用nullText
    if (isNaN(v)) {
      return nullText;
    }

    // 存在值
    let n = 2;
    let result = parseFloat((v + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";

    let l = result.split(".")[0].split("").reverse(),
      r = result.split(".")[1],
      t = "";

    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
  }

  /**
   * 处理显示两位小数金额的情况
   * 对金额的千分位四舍五入 1.989 变为1.99
   * 然后保留两位小数
   */
  static decimalAmount(value: string | number): string {
    let v1 = parseFloat(value + '');
    let result: string;

    // 非数子
    if (isNaN(v1)) {
      result = '--';
    } else {
      // 千分位四舍五入
      v1 = (Math.round(v1 * 100)) / 100;

      // 如果不是整数
      if (!MoneyApi.isInt(result)) {
        // 一位小数
        if (MoneyApi.isInt(v1 * 10)) {
          result = v1.toFixed(1);
        } else {
          result = v1.toFixed(2);
        }
      }
    }
    return result;
  }

  static isInt(v) {
    return (v % 1) === 0;
  }
}
