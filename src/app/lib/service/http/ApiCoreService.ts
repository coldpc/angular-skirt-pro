import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {HttpErrorMessage} from "./HttpErrorMessage";
import {EnRequestContentType} from "../../enums/EnRequestContentType";
import {DialogService} from "../system/dialog.service";
import {EnRequestMethod} from "../../enums/EnRequestMethod";
import {UtilsBase} from "../../utils/UtilsBase";

import {Subject, Subscription} from 'rxjs';
import {timeout, map, catchError} from 'rxjs/operators';
import {UrlApi} from "../../utils/UrlApi";
import {InHttpResponseDataFormat} from "../../interfaces/InHttpResponseDataFormat";
import {HttpApi} from "../../utils/HttpApi";
import {HttpErrorModel} from "./HttpErrorModel";
import {LoadingService} from "../system/loading.service";

// 成功返回请求的code值
const SERVICE_SUCCESS_CODE_VALUE = 0;

// 默认的basePath
const DEFAULT_PROTOCOL = location.protocol;
const DEFAULT_BASE_PATH = '';
const DEFAULT_REQUEST_HOST = 'leilingapi.ximuok.com';

// 设置headers的content-type键值
const HEADER_CONTENT_TYPE_KEY = 'Content-Type';

@Injectable()
export class ApiCoreService<T> {
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
  private _body: any = {};
  private _params: any;

  // 超时时间
  private _timeoutDuration: number = 1000 * 20;


  // 捕获异常
  private _isCatchError: boolean = false;
  private _catchErrorCode: string;

  // 服务
  private http: HttpClient;
  private loadingService: LoadingService;
  private dialogService: DialogService;

  constructor(private baseInjector: Injector) {
    this.http = this.baseInjector.get(HttpClient);
    this.loadingService = this.baseInjector.get(LoadingService);
    this.dialogService = this.baseInjector.get(DialogService);

    this.init();
  }

  init() {
    this.initHeader(this.contentType);
    this.initPath(this.path);
    this.initBody();
  }

  // 初始化body
  private initBody() {
    this.setBody(this.getBody());
  }

  // 初始化path，设置url
  private initPath(path): void {
    this.setUrl(this.getUrlByPath(path));
  }

  // 初始化headers
  private initHeader(contentType: EnRequestContentType): void {
    if (contentType !== EnRequestContentType.file) {
      this.setHeader(HEADER_CONTENT_TYPE_KEY, contentType);
    }
  }

  /**
   * 设置请求的路径
   * 需要更新url
   * @param path 路径
   */
  setPath(path): ApiCoreService<T> {
    this.setUrl(this.getUrlByPath(path));
    this.path = path;
    return this;
  }

  // 设置直接访问的url
  private setUrl(url) {
    this._url = url;
  }

  get url(): string {
    return this._url;
  }

  private getUrlByPath(path): string {
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

  public setParams(params) {
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
  unCatchError() {
    this._isCatchError = false;
    this._catchErrorCode = '';
    return this;
  }

  private get isCatchError(): boolean {
    return this._isCatchError;
  }

  private get catchErrorCode(): string {
    return this._catchErrorCode;
  }

  /**
   * 获取超时时间
   */
  getTimeoutDuration(): number {
    return this._timeoutDuration;
  }

  /**
   * 设置超时的时长
   * @param duration 时长 毫秒数
   */
  setTimeoutDuration(duration: number): ApiCoreService<T> {
    this._timeoutDuration = duration;
    return this;
  }

  /**
   * 设置发送到服务端的body内容 仅仅在post中才有使用价值
   * @param data 发送的数据
   */
  setBody(data): ApiCoreService<T> {
    this._body = HttpApi.getBodyByContentType(data, this.contentType);
    return this;
  }

  setHeader(key, value): ApiCoreService<T> {
    this._headers = this._headers.set(key, value);
    return this;
  }

  getHeaders(): HttpHeaders {
    return this._headers;
  }

  getBody(): any {
    return this._body;
  }

  // 显示加载中效果
  showLoading(): ApiCoreService<T> {
    this.loadingService.show(this.url);
    return this;
  }

  // 必须立即调用subscribe，否则可能监听不到函数
  request(onSuccess ?: (data: T) => void,
          onError ?: (error: HttpErrorModel) => void,
          onComplete ?: (api: ApiCoreService<T>) => void): void {

    debugger;
    // 获取url地址
    const url = UrlApi.addParams(this.url, this.params);

    // 获取请求的header
    const headers = this.getHeaders();

    // 添加body数据
    const body = this.getBody();

    // 发送请求
    let httpSubject = this.http.request(this.method, url, {
      headers,
      body
    }).pipe(timeout(this.getTimeoutDuration()));

    httpSubject.subscribe((httpRes: InHttpResponseDataFormat) => {
      this.handleHttpResult(this.getResponseData(httpRes), onSuccess, onError, onComplete);
    }, (httpError: HttpErrorResponse) => {
      this.handleHttpResult(this.getResponseError(httpError), onSuccess, onError, onComplete);
    });
  }

  /**
   * 处理返回结果
   * @param data 请求的数据
   * @param onSuccess 成功
   * @param onError 错误
   * @param onComplete 完成
   */
  handleHttpResult(data: any,
                   onSuccess ?: (data: T) => void,
                   onError ?: (error: HttpErrorModel) => void,
                   onComplete ?: (api: ApiCoreService<T>) => void): void {

    // 如果开始打开了 就需要隐藏了
    this.loadingService.hide(this.url);

    if (data instanceof HttpErrorModel) {
      if (this.checkIsCallError(data)) {
        UtilsBase.doCall(onError, data);
      } else {
        this.dialogService.alert(data.message);
      }
    } else {
      UtilsBase.doCall(onSuccess, data);
    }

    UtilsBase.doCall(onComplete, this);
  }

  // 控制正确返回200的异常处理
  // 在用户不捕获异常的时候 系统自动捕获异常
  // 或者不是用户捕获错误code的异常的时候 系统也要自动捕获
  // 用户未捕获异常都将执行complete操作
  checkIsCallError(error: HttpErrorModel): boolean {
    return this.isCatchError &&
      (!this.catchErrorCode || (UtilsBase.checkIsEqual(this.catchErrorCode, error.code)));
  }


  /**
   * 处理数据 返回的数据有可能也是异常的
   * 如果返回的code不是正常code的值，则认为也是异常
   * 服务端响应的数据格式为 {code, message, data}
   * @param res 响应数据
   */
  getResponseData(res: InHttpResponseDataFormat): any {
    if (!!res && UtilsBase.checkIsEqual(res.code, SERVICE_SUCCESS_CODE_VALUE)) {
      return res.data;
    } else {
      res = res || {};
      let message = HttpErrorMessage.getErrorMessageByCode(res.code + '', res.message);
      return new HttpErrorModel({code: res.code + '', message, responseData: res});
    }
  }

  /**
   * 处理服务端未正常响应的异常
   * @param response 响应数据
   */
  getResponseError(response: HttpErrorResponse) {
    let error, status = response.status;

    // 处理错误消息
    error = !!status ? HttpErrorMessage.getHasStatusError(status) :
      HttpErrorMessage.getNoStatusError(response.statusText || response.message);

    return new HttpErrorModel({
      status,
      code: error.code,
      message: error.message,
      response: HttpErrorResponse
    });
  }
}




