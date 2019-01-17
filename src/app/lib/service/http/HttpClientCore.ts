import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {HttpError} from "./HttpError";
import {InHttpService} from "./InHttpConfig";
import {EnRequestContentType} from "../../enums/EnRequestContentType";
import {DialogService} from "../system/dialog.service";
import {EnRequestMethod} from "../../enums/EnRequestMethod";
import {UtilsBase} from "../../utils/UtilsBase";

// 后端服务返回数据格式
// 200 为正常标记
export interface InHttpDataFormat {
  code?: number;
  message?: string;
  data?: any;
}

const ServiceSuccessCodeValue = 200;

// 默认的basePath
const defaultProtocol = location.protocol;
const defaultBasePath = '/h5-api';
const defaultRequestHost = location.host;

// 键值
const contentTypeKey = 'Content-Type';

@Injectable()
export class HttpClientCore {
  constructor(private http: HttpClient,
              private dialogService: DialogService) {
  }

  request({method = EnRequestMethod.post,
            contentType = EnRequestContentType.form,
            basePath,
            data,
            params,
            url
  }: InHttpService) {

    let headers, body;

    // 获取url地址
    url = this.getUrl(url, params, basePath);

    // 获取请求的header
    headers = this.getHeader(contentType);

    // 添加body数据
    body = this.getBody(data, contentType);

    // 发送请求
    return this.http.request(method + '', url, {
      headers,
      body
    });
  //
  // .subscribe(res => {
  //     return this.handleData(res as InHttpDataFormat);
  //   }, error => {
  //     return this.handleError(error);
  //   }, () => {
  //     this.onComplete();
  //   }
  }

  onComplete(): void {

  }

  handleData(res: InHttpDataFormat): any {
    if (!!res && UtilsBase.checkIsEqual(res.code, ServiceSuccessCodeValue)) {
      return res.data;
    } else {
      throw new Error(HttpError.getErrorMessageByCode(res));
    }
  }


  // 控制正确返回200的异常处理
  handleError(message: string) {
    return message;
  }

  getUrl(url, params: object = {}, bathPath = defaultBasePath): string {
    if (url.indexOf('http') !== 0) {
      url = defaultProtocol + '//' + defaultRequestHost + bathPath + url;
    }

    for (let key in Object.keys(params)) {
      if (!UtilsBase.isNull(params[key])) {
        if (url.indexOf('?') === -1) {
          url += '?';
        } else {
          url += '&';
        }
        url += key + '=' + encodeURIComponent(params[key]);
      }
    }
    return url;
  }

  getBody(data: object = {}, contentType: EnRequestContentType): any {
    let p: any, key: string;

    switch (contentType) {
      case EnRequestContentType.form:
        p = "";
        for (key in Object.keys(data)) {
          if (!UtilsBase.isNull(data[key])) {
            if (p) {
              p += "&";
            }
            p += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
          }
        }
        break;

      case EnRequestContentType.json:
        p = JSON.stringify(data);
        break;

      case EnRequestContentType.file:
        p = new FormData();

        for (key in Object.keys(data)) {
          if (!UtilsBase.isNull(data[key])) {
            p.append(key, data[key]);
          }
        }
        break;
    }
    return p;
  }

  getHeader(contentType: EnRequestContentType): HttpHeaders {
    if (contentType === EnRequestContentType.file) {
      return null;
    } else {
      let headers = new HttpHeaders();
      headers = headers.set(contentTypeKey, contentType);
      return headers;
    }
  }
}


