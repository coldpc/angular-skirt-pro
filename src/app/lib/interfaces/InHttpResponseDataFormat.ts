// 后端服务返回数据格式
// 200 为正常标记
export interface InHttpResponseDataFormat {
  code?: string;
  message?: string;
  data?: any;
}
