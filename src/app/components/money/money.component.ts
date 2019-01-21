import { Component, Input } from '@angular/core';
import {MoneyApi} from "../../lib/utils/MoneyApi";

@Component({
  selector: 'sk-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss']
})
export class MoneyComponent {
  // 是否显示小数点
  @Input() isShowDecimal: boolean = false;

  // 金额
  @Input() amount: number;

  // 是否加粗
  @Input() isBold: boolean = true;

  // 是否显示单位
  @Input() isShowUnit: boolean = true;

  // 是否显示起的文本
  @Input() isShowQiText: boolean = true;


  constructor() { }

  getDecimalAmount(value) {
    return MoneyApi.decimalAmount(value);
  }
}
