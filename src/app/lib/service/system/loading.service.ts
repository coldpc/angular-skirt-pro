import { Injectable, ComponentRef, EventEmitter} from "@angular/core";
import {SkDynamicComponentService} from "../../../components/dynamic-component-factory/sk-dynamic-component.service";
import {LoadingComponent} from "../../../components/loading/loading.component";

@Injectable()
export class LoadingService {
  private _sign: string;

  set sign(sign: string) {
    this._sign = sign;
  }
  get sign(): string {
    return this._sign;
  }

  private _loadingComponent: LoadingComponent;

  set loadingComponent(con: LoadingComponent) {
    this._loadingComponent = con;
  }

  get loadingComponent() {
    return this._loadingComponent;
  }

  constructor(private dynamicService: SkDynamicComponentService) {
  }

  show(sign: string = ''): void {
    if (!this.loadingComponent) {
      this.loadingComponent = this.dynamicService.createComponent(LoadingComponent);
    }
    if (!this.loadingComponent.isShow) {
      this.loadingComponent.isShow = true;
      this.sign = sign;
    }
  }

  hide(sign = '') {
    if (this.sign === sign) {
      this.loadingComponent.isShow = false;
    }
  }
}
