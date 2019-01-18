import {EnRequestContentType} from "../enums/EnRequestContentType";
import {UtilsBase} from "./UtilsBase";

export class HttpApi {
  /**
   * 获取body，根据data
   * @param data 数据
   * @param contentType 内容类型 EnRequestContentType
   */
  static getBodyByContentType(data: object = {}, contentType: EnRequestContentType): any {
    let body: any;

    switch (contentType) {
      case EnRequestContentType.form:
        body = HttpApi.getFormBody(data);
        break;

      case EnRequestContentType.json:
        body = HttpApi.getJsonBody(data);
        break;

      case EnRequestContentType.file:
        body = HttpApi.getFileBody(data);
        break;
    }
    return body;
  }

  static getJsonBody(data): string {
    return JSON.stringify(data);
  }

  static getFormBody(data): string {
    let body = "", index, key;
    for (key of Object.keys(data)) {
      if (!UtilsBase.isNull(data[key])) {
        if (body) {
          body += "&";
        }
        body += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
      }
    }
    return body;
  }

  static getFileBody(data): FormData {
    let body = new FormData(), key;

    for (key of Object.keys(data)) {
      if (!UtilsBase.isNull(data[key])) {
        body.append(key, data[key]);
      }
    }
    return body;
  }
}
