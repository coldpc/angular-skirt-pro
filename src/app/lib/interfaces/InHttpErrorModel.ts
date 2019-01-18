import {InErrorModel} from "./InErrorModel";

export interface InHttpErrorModel extends InErrorModel {
  response ?: any;
  request ?: any;
  responseData ?: any;
  status ?: any;
}
