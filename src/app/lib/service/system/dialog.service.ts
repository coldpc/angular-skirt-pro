import { Injectable, ComponentRef, EventEmitter} from "@angular/core";
import {DialogComponent} from "../../../components/dialog/dialog.component";
import {SkDynamicComponentService} from "../../../components/dynamic-component-factory/sk-dynamic-component.service";
import {InDialogModel} from "../../interfaces/InDialogModel";

@Injectable()
export class DialogService {
  private _dialogComponent: DialogComponent;
  set dialogComponent(con: DialogComponent) {
    this._dialogComponent = con;
  }

  get dialogComponent() {
    return this._dialogComponent;
  }

  constructor(private dynamicService: SkDynamicComponentService) {
  }

  /**
   * 消息框
   * @param message 消息内容
   */
  alert(message: string) {
    this.show({message, isConfirm: false});
  }

  /**
   * 确认框
   * @param config 配置
   */
  confirm(config: InDialogModel) {
    config.isConfirm = true;
    this.show(config);
  }

  /**
   * 展示对话框
   * @param config 配置
   */
  show(config: InDialogModel): void {
    if (!this.dialogComponent) {
      this.dialogComponent = this.dynamicService.createComponent(DialogComponent);
    }
    let dialog = this.dialogComponent;
    dialog.isConfirm = config.isConfirm;
    dialog.okText = config.okText;
    dialog.cancelText = config.cancelText;
    dialog.message = config.message;

    // 监听事件
    this.subscribeEvent(dialog.okEvent, config.onOk);
    this.subscribeEvent(dialog.cancelEvent, config.onCancel);
    this.subscribeEvent(dialog.hideEvent, config.onHide);
    this.subscribeEvent(dialog.showEvent, config.onShow);

    // 显示
    dialog.isShow = true;
  }

  subscribeEvent(event: EventEmitter<any>, call) {
    event.observers.splice(0);
    if (typeof call === 'function') {
      event.subscribe(call);
    }
  }
}
