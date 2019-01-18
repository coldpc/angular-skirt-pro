import {EnHttpErrorCode} from "../../enums/EnHttpErrorCode";

export const ErrorCodeMapMessage = {
  [402]: '参数错误',
  [500]: '服务端错误',
  [20001]: '手机号码未注册',
  [20002]: '密码无效',
  [20003]: '用户不存在',
  [20004]: '服务端错误',
  [20005]: '密码格式不合法',
  [20006]: '密码更新失败',
  [20007]: '发送短信验证码失败',
  [20008]: '该手机号已经注册',
  [20009]: '旧密码错误',
  [20010]: '新密码跟旧密码相同',
  [20011]: '修改手机号验证码无效',
  [20012]: '验证码已使用',
  [20013]: '服务端错误',
  [20014]: '验证码已过期',
  [20015]: '验证码无效',
  [20016]: '已超过验证码尝试最大次数',
  [EnHttpErrorCode.unknown]: '服务器出现一些小问题，请联系客服',

  // 自定义异常
  [EnHttpErrorCode.timeout]: '请求超时啦',
  [EnHttpErrorCode.noNetwork]: '请确认您已连接到网络',
  [EnHttpErrorCode.noService]: '请求的服务器不在地球上',
  [EnHttpErrorCode.statusOther]: '请求出现了异常',
  [EnHttpErrorCode.status400]: '服务端出现内部错误，请联系客服',
  [EnHttpErrorCode.status404]: '请求的路径不正确'
};
