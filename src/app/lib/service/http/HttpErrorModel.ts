import {InHttpErrorModel} from "../../interfaces/InHttpErrorModel";

/**
 * http异常模型
 */
export class HttpErrorModel implements InHttpErrorModel {
  code: string;
  status: number;
  message: string;
  response: any;
  request: any;
  responseData: any;

  constructor(params: InHttpErrorModel) {
    this.code = params.code;
    this.message = params.message;
    this.response = params.response;
    this.request = params.request;
    this.responseData = params.responseData;
    this.status = params.status;
  }
}
