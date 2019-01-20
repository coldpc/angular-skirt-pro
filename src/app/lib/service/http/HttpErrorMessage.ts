import {InErrorModel} from "../../interfaces/InErrorModel";
import {EnHttpErrorCode} from "../../enums/EnHttpErrorCode";
import {ErrorCodeMapMessage} from "./ErrorCodeMapMessage";

export class HttpErrorMessage {
  /**
   * 获取code对应的错误message
   * @param code 错误code 不存在就取出返回的内部错误消息 否则就为未知异常
   * @param responseMessage 响应的消息
   */
  static getErrorMessageByCode(code: string, responseMessage ?: string): string {
    return ((!!code) && ErrorCodeMapMessage[code]) || (responseMessage || ErrorCodeMapMessage[EnHttpErrorCode.unknown]);
  }

  /**
   * 服务端响应没有status的时候，分为几种情况
   * 1 未连接网络
   * 2 超时了
   * 3 服务器根本不存在
   * @param statusText 错误文本
   */
  static getNoStatusError(statusText): InErrorModel {
    let code;
    if (!window.navigator.onLine) {
      code = EnHttpErrorCode.noNetwork;
    } else if (statusText.toLowerCase().indexOf("timeout") > -1) {
        code = EnHttpErrorCode.timeout;
    } else {
      code = EnHttpErrorCode.noService;
    }
    return {
      code,
      message: HttpErrorMessage.getErrorMessageByCode(code)
    };
  }

  /**
   * 返回错误status的时，情况非常多，所以需要区分
   * 目前系统只处理400和404
   * @param status 错误状态
   */
  static getHasStatusError(status): InErrorModel {
    let code;

    switch (status) {
      case 404:
        code = EnHttpErrorCode.status404;
        break;

      case 400:
        code = EnHttpErrorCode.status400;
        break;

      default:
       code = EnHttpErrorCode.statusOther;
    }
    return {
      code,
      message: HttpErrorMessage.getErrorMessageByCode(code)
    };
  }
}
