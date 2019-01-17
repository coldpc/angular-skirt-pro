import {EnRequestContentType} from "../../enums/EnRequestContentType";
import {EnRequestMethod} from "../../enums/EnRequestMethod";

export interface InHttpService {
  url: string;
  basePath ?: string;
  data ?: any;
  contentType ?: EnRequestContentType;
  method ?: EnRequestMethod;
  params ?: object;
}
