import {ActivatedRoute, Params, Router} from "@angular/router";
import { Location } from '@angular/common';
import {Injectable} from "@angular/core";
import {EnHistoryState} from "../../enums/EnHistoryState";
import {UtilsBase} from "../../utils/UtilsBase";
import {InRouterPath} from "../../interfaces/InRouterPath";
import {EnRouterPath} from "../../enums/EnRouterPath";


export const USER_LOGIN_URL = "page/user/login";

@Injectable()
export class RouterCoreService {
  queryParams: Params;
  historyState: string = '';

  constructor(private router: Router,
              private location: Location,
              private activatedRoute: ActivatedRoute) {
    this.initQueryParams();

    // 根据历史
    window.addEventListener("popstate", (e) => {
      this.historyState = "back";
    }, false);
  }

  // 处理参数
  initQueryParams() {
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      // 驼峰命名转化参数
      let parse: Params = this.queryParams = {};
      for (let key in queryParams) {
        parse[UtilsBase.transToUppercase(key)] = queryParams[key];
      }
      this.queryParams = parse;
    });
  }

  // 加载页面
  loadPage(data: InRouterPath) {
    // 处理params 转化为下划线
    let queryParams = data.params;

    // 大小写转化为下划线分隔开
    if (queryParams) {
      for (let key in queryParams) {
        queryParams[UtilsBase.transToUnderline(key)] = queryParams[key];
        delete queryParams[key];
      }
    }

    // 跳转路由
    this.router.navigate([data.path], {
      queryParams,
      replaceUrl: data.historyState === EnHistoryState.replace
    }).catch(e => {
      console.log(e);
    });
  }

  // 返回
  gotoBack() {
    // 返回
    this.location.back();

    // 标记是否历史返回操作
    let isBack = false;
    window.addEventListener('popstate', setIsBack);

    setTimeout((_this) => {
      window.removeEventListener('popstate', setIsBack);
      if (!isBack) {
        _this.backHome();
      }
    }, 100, this);

    // 设置是触发返回的操作
    function setIsBack() {
      isBack = true;
    }
  }

  // 去重定向的页面 登陆之后调用比较合适
  gotoRedirect() {
    let redirect = this.queryParams.redirect;
    if (redirect.indexOf("http") > -1) {
      location.href = redirect;
    } else {
      let router = this.analysisPath();
      this.loadPage({path: router.path, params: router.params, historyState: EnHistoryState.replace});
    }
  }

  /**
   * 重定向页面，将会将redirect的参数url转接出去
   * @param path 目标地址
   */
  redirectPage(path) {
    this.loadPage({
      path,
      params: {
        redirect: this.queryParams.redirect || location.href
      },
      historyState: EnHistoryState.replace
    });
  }

  // 分析path的参数以及路由
  analysisPath(): InRouterPath {
    let url = this.queryParams.redirect || '/';
    let params;
    let searchIndex = url.indexOf('?');
    if (searchIndex > -1) {
      params = this.parseParas(url.substring(searchIndex + 1));
      url = this.getPath(url.substring(0, searchIndex));
    }
    return {
      path: this.getRouterPath(url),
      params: params || {}
    };
  }

  // 通过uri获取path http://
  getPath(uri: string): string {
    let host = location.host || '';
    return uri.substring(uri.indexOf(host) + location.host.length);
  }

  // 通过地址 获取路由path
  getRouterPath(url: string) {
    let index = url.indexOf('page');

    if (index !== -1) {
      url = url.substring(index);
    } else {
      url = '/';
    }
    return url;
  }

  // 通过search获取para
  parseParas(paras: string): Params {
    let l = paras.length;
    if (l > 0) {
      let items = paras.split("&");
      let item, name, i, value, args = {};
      l = items.length;
      for (i = 0; i < l; i++) {
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) {
          args[name] = value;
        }
      }
      return args;
    } else {
      return {};
    }
  }

  // 去登陆
  gotoLogin(isForce: boolean = false) {
    let url = location.href;

    // 在登陆页面不需要跳转登陆
    if (url.indexOf(USER_LOGIN_URL) === -1) {

      // 如果是强制性 或者 不在注册页面也可以跳转
      if (isForce || url.indexOf(EnRouterPath.login) === -1) {
        this.redirectPage(USER_LOGIN_URL);
      }
    }
  }

  backHome() {
    this.loadPage({
      path: EnRouterPath.home,
      historyState: EnHistoryState.replace
    });
  }
}
