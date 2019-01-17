import {InHttpDataFormat} from "./HttpClientCore";

const RESPONSE_CODE_402 = 402;
const RESPONSE_CODE_500 = 500;
const RESPONSE_CODE_20001 = 20001;
const RESPONSE_CODE_20002 = 20002;
const RESPONSE_CODE_20003 = 20003;
const RESPONSE_CODE_20004 = 20004;
const RESPONSE_CODE_20005 = 20005;
const RESPONSE_CODE_20006 = 20006;
const RESPONSE_CODE_20007 = 20007;
const RESPONSE_CODE_20008 = 20008;
const RESPONSE_CODE_20009 = 20009;
const RESPONSE_CODE_20010 = 20010;
const RESPONSE_CODE_20011 = 20011;
const RESPONSE_CODE_20012 = 20012;
const RESPONSE_CODE_20013 = 20013;
const RESPONSE_CODE_20014 = 20014;
const RESPONSE_CODE_20015 = 20015;
const RESPONSE_CODE_20016 = 20016;

export class HttpError {
  static getErrorMessageByCode(res: InHttpDataFormat): string {
    res = res || {};
    let message: string;
    switch (res.code) {
      case RESPONSE_CODE_402:
        message = "参数错误";
        break;
      case RESPONSE_CODE_500:
        message = "服务端错误";
        break;
      case RESPONSE_CODE_20001:
        message = "手机号码未注册";
        break;
      case RESPONSE_CODE_20002:
        message = "密码无效";
        break;
      case RESPONSE_CODE_20003:
        message = "用户不存在";
        break;
      case RESPONSE_CODE_20004:
        message = "服务端错误";
        break;
      case RESPONSE_CODE_20005:
        message = "密码格式不合法";
        break;
      case RESPONSE_CODE_20006:
        message = "密码更新失败";
        break;
      case RESPONSE_CODE_20007:
        message = "发送短信验证码失败";
        break;
      case RESPONSE_CODE_20008:
        message = "该手机号已经注册";
        break;
      case RESPONSE_CODE_20009:
        message = "旧密码错误";
        break;
      case RESPONSE_CODE_20010:
        message = "新密码跟旧密码相同";
        break;
      case RESPONSE_CODE_20011:
        message = "修改手机号验证码无效";
        break;
      case RESPONSE_CODE_20012:
        message = "验证码已使用";
        break;
      case RESPONSE_CODE_20013:
        message = "服务端错误";
        break;
      case RESPONSE_CODE_20014:
        message = "验证码已过期";
        break;
      case RESPONSE_CODE_20015:
        message = "验证码无效";
        break;
      case RESPONSE_CODE_20016:
        message = "已超过验证码尝试最大次数";
        break;
      default:
        message = message || res.message || '服务器出现一些小问题，请联系客服';
        break;
    }
    return message;
  }
}
