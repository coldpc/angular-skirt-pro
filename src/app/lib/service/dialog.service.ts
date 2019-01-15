import { Injectable} from "@angular/core";

export interface InDialogModel {
  type ?: string;
  title ?: string;
  content ?: string;
  btnGroup ?: Array<string>;
  close ?: Function;
  ok ?: Function;
  cancel ?: Function;
}

@Injectable()
export class DialogService {

  constructor() {}
}
