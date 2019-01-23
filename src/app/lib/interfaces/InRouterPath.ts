import {EnHistoryState} from "../enums/EnHistoryState";

export interface InRouterPath {
  path ?: string;
  params?: any;
  historyState ?: EnHistoryState;
}

