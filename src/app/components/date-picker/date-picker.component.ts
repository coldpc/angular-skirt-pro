/**
 *  使用说明
 *  dataType： datetime | date | time | month | hour
 *  value： 可以设置初选中的值
 *  options：配置复杂的显示
 *  <app-sk-date-picker dataType="month" [value]="value"></app-sk-date-picker>
 *
 */


import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {PickerComponent} from "../picker/picker.component";
import {ModalComponent} from "../modal/modal.component";
import {DynamicCore} from "../dynamicCore/DynamicCore";

export enum Type {
  datetime = 'datetime', // 完整日期视图(年月日时分)
  date = 'date', // 年视图(年月日)
  time = 'time', // 时间视图(时分)
  month = 'month', // 月视图(年月)
  hour = 'hour' // 时视图(年月日时)
}

export interface SeparateValue {
  y?: string;
  m?: string;
  d?: string;
  h?: string;
  i?: string;
}

export interface DatePickerOptions {
  labels?: LabelsText; // 可设置["年", "月", "日", "时", "分"]这五个字段,
  titles?: TitlesText; // 可设置["年", "月", "日", "时", "分"]这五个字段,
  buttons?: ButtonsText; // 可设置确定取消,
  beginDate?: Date; // beginYear:2015
  beginYear?: number;
  endDate?: Date;
  endMonth?: number;
  endYear?: number;
  beginMonth?: number;
  beginDay?: number;
  endDay?: number;
  beginHours?: number;
  endHours?: number;
  beginMinutes?: number;
  endMinutes?: number;
  customData?: CustomData;
}

export interface ButtonsText {
  ok?: string;
  cancel?: string;
}

export interface CustomData {
  y?: Array<any>;
  m?: Array<any>;
  d?: Array<any>;
  h?: Array<any>;
  i?: Array<any>;
}

export interface LabelsText {
  y?: string;
  m?: string;
  d?: string;
  h?: string;
  i?: string;
}

export interface TitlesText extends LabelsText {
  y?: string;
  m?: string;
  d?: string;
  h?: string;
  i?: string;
}

const BIG_MONTH = ["01", "03", "05", "07", "08", "10", "12"];
const SMALL_MONTH = ["02", "04", "06", "09", "11"];
const DEFAULT_LABELS: LabelsText = {y: '年', m: '月', d: '日', h: '时', i: '分'};
const DEFAULT_TITLES: TitlesText = {y: '年', m: '月', d: '日', h: '时', i: '分'};
const DEFAULT_BUTTONS: ButtonsText = {ok: '取消', cancel: '确定'};
const DEFAULT_TYPE = Type.datetime;

@Component({
  selector: 'sk-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent extends DynamicCore implements OnInit, OnChanges {

  @Input() title: string = '选择日期';
  @Input() dataType: string;
  @Input() options: DatePickerOptions;
  @Input() value: string;
  @Output() change: EventEmitter<any> = new EventEmitter();

  // 声明获取native element的需要
  @ViewChild("year") year: PickerComponent;
  @ViewChild("month") month: PickerComponent;
  @ViewChild("day") day: PickerComponent;
  @ViewChild("hour") hour: PickerComponent;
  @ViewChild("minute") minute: PickerComponent;
  @ViewChild("view") view: ModalComponent;

  buttonsText: ButtonsText;
  labelsText: LabelsText;
  titles: TitlesText = {};
  myDataType: string;

  yearListOption: Array<string>;
  monthListOption: Array<string>;
  dayListOption: Array<string>;
  hourListOption: Array<string>;
  minuteListOption: Array<string>;
  separateValue: SeparateValue;

  result: SeparateValue = {
    y: null,
    m: null,
    d: null,
    h: null,
    i: null
  };

  static compareTwoArray(arr1: Array<any> = [], arr2: Array<any> = []): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    let result = true;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        result = false;
        break;
      }
    }
    return result;
  }

  // 是否为闰年
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  static fill(num: number): string {
    return num < 10 ? "0" + num : num.toString();
  }

  static inArray(array: Array<any>, item: any): boolean {
    item = item + '';
    if (item.length === 1) {
      item = '0' + item;
    }

    for (let index in array) {
      if (array[index] === item) {
        return true;
      }
    }
    return false;
  }

  static getDayNum(year: number, month: number): number {
    if (DatePickerComponent.inArray(BIG_MONTH, month)) {
      return 31;
    } else if (DatePickerComponent.inArray(SMALL_MONTH, month)) {
      return 30;
    } else if (DatePickerComponent.isLeapYear(year)) {
      return 29;
    } else {
      return 28;
    }
  }

  static parseValue(value: string) {
    let rs: SeparateValue = {};
    if (value) {
      let parts: string[] = value.replace(":", "-").replace(" ", "-").split("-");
      rs.y = DatePickerComponent.fill(parseInt(parts[0], 10));
      rs.m = DatePickerComponent.fill(parseInt(parts[1], 10));
      rs.d = DatePickerComponent.fill(parseInt(parts[2], 10));
      rs.h = DatePickerComponent.fill(parseInt(parts[3], 10));
      rs.i = DatePickerComponent.fill(parseInt(parts[4], 10));
    } else {
      let now = new Date();
      rs.y = DatePickerComponent.fill(now.getFullYear());
      rs.m = DatePickerComponent.fill(now.getMonth() + 1);
      rs.d = DatePickerComponent.fill(now.getDate());
      rs.h = DatePickerComponent.fill(now.getHours());
      rs.i = DatePickerComponent.fill(now.getMinutes());
    }
    return rs;
  }

  ngOnInit() {
    this.setDataType(this.dataType);
    this.create();
    this.setSelectedValue(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && !changes.value.firstChange) {
      this.setSelectedValue(changes.value.currentValue);
    }
  }

  getSelectedValue(): string {
    let separator = "-";
    let value: string;
    switch (this.myDataType) {
      case Type.datetime:
        value = this.getYearValue() + separator + this.getMonthValue() + separator + this.getDayValue() + " " +
          this.getHourValue() + ":" + this.getMinuteValue();
        break;
      case Type.date:
        value = this.getYearValue() + separator + this.getMonthValue() + separator + this.getDayValue();
        break;
      case Type.time:
        value = this.getHourValue() + ":" + this.getMinuteValue();
        break;
      case Type.month:
        value = this.getYearValue() + separator + this.getMonthValue();
        break;
      case Type.hour:
        value = this.getYearValue() + separator + this.getMonthValue() + separator + this.getDayValue() + " " + this.getHourValue();
        break;
    }
    return value;
  }

  getIsShow(type: string) {
    let _isShow = true;
    switch (this.myDataType) {
      case Type.datetime:
        _isShow = true;
        break;
      case Type.date:
        _isShow = 'ymd'.indexOf(type) !== -1;
        break;
      case Type.time:
        _isShow = 'hi'.indexOf(type) !== -1;
        break;
      case Type.month:
        _isShow = 'ym'.indexOf(type) !== -1;
        break;
      case Type.hour:
        _isShow = 'ymdh'.indexOf(type) !== -1;
        break;
    }
    return _isShow;
  }

  getYearValue(): string {
    return this.result.y;
  }

  getYearValueNum(): number {
    return parseInt(this.getYearValue(), 10);
  }

  getMonthValue(): string {
    return this.result.m;
  }

  getMonthValueNum(): number {
    return parseInt(this.getMonthValue(), 10);
  }

  getDayValue(): string {
    return this.result.d;
  }

  getDayValueNum(): number {
    return parseInt(this.getDayValue(), 10);
  }

  getHourValue(): string {
    return this.result.h;
  }

  getHourValueNum(): number {
    return parseInt(this.getHourValue(), 10);
  }

  getMinuteValue(): string {
    return this.result.i;
  }

  _isBeginYear(): boolean {
    return this.options.beginYear === this.getYearValueNum();
  }

  _isBeginMonth(): boolean {
    return this.options.beginMonth && this._isBeginYear() && this.options.beginMonth === this.getMonthValueNum();
  }

  _isBeginDay(): boolean {
    return this._isBeginMonth() && this.options.beginDay === this.getDayValueNum();
  }

  _isBeginHours(): boolean {
    return this._isBeginDay() && this.options.beginHours === this.getHourValueNum();
  }

  _isEndHours(): boolean {
    return this._isEndDay() && this.options.endHours === this.getHourValueNum();
  }

  _isEndYear(): boolean {
    return this.options.endYear === parseInt(this.getYearValue(), 10);
  }

  _isEndMonth(): boolean {
    return this.options.endMonth && this._isEndYear() && this.options.endMonth === this.getMonthValueNum();
  }

  _isEndDay(): boolean {
    return this._isEndMonth() && this.options.endDay === this.getDayValueNum();
  }

  onChangeYear(e) {
    this.result.y = e.value;
    this.createMonth();
  }

  onChangeMonth(e) {
    this.result.m = e.value;
    this.createDay();
  }

  onChangeDay(e) {
    this.result.d = e.value;
    this.createHours();
  }

  onChangeHour(e) {
    this.result.h = e.value;
    this.createMinutes();
  }

  onChangeMinute(e) {
    this.result.i = e.value;
  }

  createYear(): Array<string> {
    let self = this;
    let options = self.options;

    // 生成年列表
    let yArray;
    if (options.customData.y) {
      yArray = options.customData.y;
    } else {
      let yBegin = options.beginYear;
      let yEnd = options.endYear;
      yArray = [];
      for (let y = yBegin; y <= yEnd; y++) {
        yArray.push(y + "");
      }
    }
    return this.yearListOption = yArray;
  }

  createMonth(): Array<string> {
    let options = this.options;
    // 生成月列表
    let mArray = options.customData.m;
    if (mArray) {
      if (this.monthListOption !== mArray) {
        this.monthListOption = mArray;
      }
    } else {
      let m = options.beginMonth && this._isBeginYear() ? options.beginMonth : 1;
      let maxMonth = options.endMonth && this._isEndYear() ? options.endMonth : 12;
      mArray = [];
      for (; m <= maxMonth; m++) {
        mArray.push(DatePickerComponent.fill(m));
      }

      if (!DatePickerComponent.compareTwoArray(mArray, this.monthListOption)) {
        this.monthListOption = mArray;
      }
    }
    return mArray;
  }

  createDay(): Array<string> {
    let options = this.options;
    // 生成日列表
    let dArray = [];
    let optionsDayList = this.options.customData.d;

    if (optionsDayList) {
      if (this.dayListOption !== optionsDayList) {
        this.dayListOption = optionsDayList;
      }
      dArray = optionsDayList;
    } else {
      let d = this._isBeginMonth() ? options.beginDay : 1;
      let val;
      let maxDay = this._isEndMonth() ? options.endDay :
        DatePickerComponent.getDayNum(this.getYearValueNum(), this.getMonthValueNum());
      for (; d <= maxDay; d++) {
        val = DatePickerComponent.fill(d);
        dArray.push(val + "");
      }

      if (!DatePickerComponent.compareTwoArray(dArray, this.dayListOption)) {
        this.dayListOption = dArray;
      }
    }
    return dArray;
  }


  createHours() {
    let self = this;
    let options = self.options;

    // 生成时列表
    let hArray = [];
    let optionsHourList = options.customData.h;
    if (optionsHourList) {
      if (!this.hourListOption) {
        this.hourListOption = optionsHourList;
      }
    } else {
      let h = self._isBeginDay() ? options.beginHours : 0;
      let val;
      let maxHours = self._isEndDay() ? options.endHours : 23;
      for (; h <= maxHours; h++) {
        val = DatePickerComponent.fill(h);
        hArray.push(val + "");
      }

      if (!DatePickerComponent.compareTwoArray(hArray, this.hourListOption)) {
        this.hourListOption = hArray;
      }
    }
  }

  createMinutes(): void {
    let self = this;
    let options = self.options || {};
    this.options.customData = this.options.customData || {};

    // 生成分列表
    let optionsMinuteList = this.options.customData.i;
    if (optionsMinuteList) {
      if (!this.minuteListOption) {
        this.minuteListOption = optionsMinuteList;
      }
    } else {
      let i = self._isBeginHours() ? options.beginMinutes : 0;
      let val;
      let maxMinutes = self._isEndHours() ? options.endMinutes : 59;
      let iArray = [];
      for (; i <= maxMinutes; i++) {
        val = DatePickerComponent.fill(i);
        iArray.push(val + "");
      }

      if (!DatePickerComponent.compareTwoArray(iArray, this.minuteListOption)) {
        this.minuteListOption = iArray;
      }
    }
  }

  setLabels(labels: LabelsText = DEFAULT_LABELS): LabelsText {
    this.labelsText = labels;
    return labels;
  }

  setButtons(buttonsText: ButtonsText = DEFAULT_BUTTONS): ButtonsText {
    this.buttonsText = buttonsText;
    return buttonsText;
  }

  setTitles(titlesText: TitlesText = DEFAULT_TITLES): TitlesText {
    this.titles = titlesText;
    return titlesText;
  }

  setDataType(dataType: string = DEFAULT_TYPE): void {
    this.myDataType = dataType;
  }

  create(options: DatePickerOptions = {}) {
    let self = this, now;

    options.customData = options.customData = {};
    self.options = options;
    now = new Date();

    // 设定了开始日期
    let beginDate = options.beginDate;
    if (beginDate instanceof Date && !isNaN(beginDate.valueOf())) {
      options.beginYear = beginDate.getFullYear();
      options.beginMonth = beginDate.getMonth() + 1;
      options.beginDay = beginDate.getDate();
      options.beginHours = beginDate.getHours();
      options.beginMinutes = beginDate.getMinutes();
    }

    // 设定了结束日期
    let endDate = options.endDate;
    if (endDate instanceof Date && !isNaN(endDate.valueOf())) {
      options.endYear = endDate.getFullYear();
      options.endMonth = endDate.getMonth() + 1;
      options.endDay = endDate.getDate();
      options.endHours = endDate.getHours();
      options.endMinutes = endDate.getMinutes();
    }

    options.beginYear = options.beginYear || (now.getFullYear() - 5);
    options.endYear = options.endYear || (now.getFullYear() + 5);

    // 设定label
    self.setLabels(options.labels);
    self.setButtons(options.buttons);
    self.setTitles(options.titles);

    // 生成
    self.initCreate();
  }

  initCreate() {
    switch (this.myDataType) {
      case Type.time:
        this.createHours();
        break;
      default:
        this.createYear();
    }
  }

  confirm() {
    let item = this.getSelectedValue();
    this.change.emit({value: item, item: item});
  }

  setSelectedValue(date: string): void {
    this.separateValue = DatePickerComponent.parseValue(date);
    this.result = Object.assign({}, this.separateValue);
  }
}
