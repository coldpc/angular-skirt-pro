import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {HttpErrorMessage} from "./HttpErrorMessage";
import {EnRequestContentType} from "../../enums/EnRequestContentType";
import {DialogService} from "../system/dialog.service";
import {EnRequestMethod} from "../../enums/EnRequestMethod";
import {UtilsBase} from "../../utils/UtilsBase";

import {Subject} from 'rxjs';
import {timeout} from 'rxjs/operators';
import {UrlApi} from "../../utils/UrlApi";
import {InHttpResponseDataFormat} from "../../interfaces/InHttpResponseDataFormat";
import {HttpApi} from "../../utils/HttpApi";
import {HttpErrorModel} from "./HttpErrorModel";

// 成功返回请求的code值
const SERVICE_SUCCESS_CODE_VALUE = 200;

// 默认的basePath
const DEFAULT_PROTOCOL = location.protocol;
const DEFAULT_BASE_PATH = '/h5-api';
const DEFAULT_REQUEST_HOST = location.host;

// 设置headers的content-type键值
const HEADER_CONTENT_TYPE_KEY = 'Content-Type';

@Injectable()
export class HttpClientCore<T> extends Subject<T>  {
  // 默认的协议
  public protocol = DEFAULT_PROTOCOL;

  // 请求方式为post
  public method = EnRequestMethod.post;

  // contentType
  public contentType = EnRequestContentType.form;

  // 接口通用的路径 /h5-api
  public basePath = DEFAULT_BASE_PATH;

  // 主机地址
  public host = DEFAULT_REQUEST_HOST;

  // 请求的path 必须覆盖
  public path = '/test';

  // 请求地址 body headers timeout params
  private _url: string;
  private _headers: HttpHeaders = new HttpHeaders();
  private _body: any;
  private _params: any;
  private _timeout: number = 1000 * 20;


  // 捕获异常
  private _isCatchError: boolean = false;
  private _catchErrorCode: string;

  constructor(private http: HttpClient,
              private dialogService: DialogService) {
    super();

    this.initHeader(this.contentType);
    this.initPath(this.path);
  }

  // 初始化path，设置url
  initPath(path): void {
    this.setUrl(this.getUrlByPath(path));
  }

  // 初始化headers
  initHeader(contentType: EnRequestContentType): void {
    if (contentType !== EnRequestContentType.file) {
      this.setHeader(HEADER_CONTENT_TYPE_KEY, contentType);
    }
  }

  /**
   * 设置请求的路径
   * @param path 路径
   */
  setPath(path): HttpClientCore<T>  {
    this.setUrl(this.getUrlByPath(path));
    this.path = path;
    return this;
  }

  private setUrl(url) {
    this._url = url;
  }

  get url(): string {
    return this._url;
  }

  getUrlByPath(path): string {
    let url;
    if (path.indexOf('http') !== 0) {
      url = this.protocol + '//' + this.host + this.basePath + path;
    } else {
      url = path;
    }
    return url;
  }

  get params(): any {
    return this._params;
  }

  setParams(params) {
    this._params = params;
    return this;
  }

  /**
   * 捕获异常
   * @param code 默认所有异常
   */
  catchError(code = '') {
    this._isCatchError = true;
    this._catchErrorCode = code;
    return this;
  }

  /**
   * 不捕获异常
   */
  uncatchError() {
    this._isCatchError = false;
    this._catchErrorCode = '';
    return this;
  }

  get isCatchError(): boolean {
    return this._isCatchError;
  }

  get catchErrorCode(): string {
    return this._catchErrorCode;
  }

  /**
   * 获取超时时间
   */
  getTimeout(): number {
    return this._timeout;
  }

  /**
   * 设置时长
   * @param duration 时长
   */
  setTimeout(duration: number): HttpClientCore<T> {
    this._timeout = duration;
    return this;
  }

  /**
   * 设置发送到服务端的body内容 仅仅在post中才有使用价值
   * @param data 发送的数据
   */
  setBody(data): HttpClientCore<T> {
    this._body = HttpApi.getBodyByContentType(data, this.contentType);
    return this;
  }

  setHeader(key, value): HttpClientCore<T> {
    this._headers = this._headers.set(key, value);
    return this;
  }

  getHeaders(): HttpHeaders {
    return this._headers;
  }

  getBody(): any {
    return this._body;
  }

  request() {
    this.closed = false;
    let headers, body, url;

    // 获取url地址
    url = UrlApi.addParams(this.url, this.params);

    // 获取请求的header
    headers = this.getHeaders();

    // 添加body数据
    body = this.getBody();

    // 发送请求
    this.http.request(this.method, url, {
      headers,
      body
    }).pipe(timeout(this.getTimeout()))
      .subscribe((res) => {
      this.handleData(res);
    }, (error: HttpErrorResponse) => {
      return this.handleResponseError(error);
    }, () => {});
  }

  /**
   * 事件流出
   * @param data 响应的数据
   */
  next(data) {
    super.next(data);
  }

  /**
   * 处理数据 返回的数据有可能也是异常的
   * 如果返回的code不是正常code的值，则认为也是异常
   * 服务端响应的数据格式为 {code, message, data}
   * @param res 响应数据
   */
  handleData(res: InHttpResponseDataFormat): any {
    if (!!res && UtilsBase.checkIsEqual(res.code, SERVICE_SUCCESS_CODE_VALUE)) {
      this.next(res.data);
    } else {
      res = res || {};
      let message = HttpErrorMessage.getErrorMessageByCode(res.code);

      // 抛出异常
      this.handleError(new HttpErrorModel({code: res.code, message, responseData: res}));
    }
  }

  // 控制正确返回200的异常处理
  handleError(error: HttpErrorModel) {
    console.log(error);

    // 在用户不捕获异常的时候 系统自动捕获异常
    // 或者不是用户捕获错误code的异常的时候 系统也要自动捕获
    if (this.isCatchError &&
      (!this.catchErrorCode ||
        (UtilsBase.checkIsEqual(this.catchErrorCode, error.code)))) {
      super.error(error);
    } else {
      this.dialogService.alert(error.message);
    }
  }

  /**
   * 处理服务端未正常响应的异常
   * @param response 响应数据
   */
  handleResponseError(response: HttpErrorResponse) {
    let error, status = response.status;

    // 处理错误消息
    error = !!status ? HttpErrorMessage.getHasStatusError(status) :
      HttpErrorMessage.getNoStatusError(response.statusText || response.message);

    this.handleError(new HttpErrorModel({
      status,
      code: error.code,
      message: error.message,
      response: HttpErrorResponse
    }));
  }
}




