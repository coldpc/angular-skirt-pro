export interface InDialogModel {
  isConfirm ?: boolean;
  message ?: string;
  cancelText ?: string;
  okText ?: string;
  onShow ?: Function;
  onHide ?: Function;
  onOk ?: Function;
  onCancel ?: Function;
}
