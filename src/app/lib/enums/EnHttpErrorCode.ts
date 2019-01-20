export enum EnHttpErrorCode {
  unknown = 'UNKNOWN_ERROR_CODE', // 未知错误 服务器返回空数据 没有code的异常
  timeout = 'TIMEOUT', // 超时
  noService = 'NO_SERVICE', // 请求的服务不存在
  noNetwork = 'NO_NETWORK', // 未连接网络
  status404 = 'STATUS_404',
  status400 = 'STATUS_400',
  statusOther = 'status_other'
}
