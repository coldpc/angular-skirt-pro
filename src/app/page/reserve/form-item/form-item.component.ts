import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'sk-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.scss'],
  host: {
    '[class.blur]': '!isFocus',
    '[class.focus]': 'isFocus'
  }
})
export class FormItemComponent implements OnInit, AfterViewInit {
  @Input() isFocus: boolean = false;
  @Input() placeholder: string = '';
  @Input() selectText: string = '';
  @Input() type: string = 'text';
  @Input() level: number = 0;

  isCommonInput = true;

  value = '';

  isShow = false;

  constructor() { }

  ngOnInit() {
    this.isCommonInput = this.type === 'text' || this.type === 'number';
  }

  ngAfterViewInit(): void {

  }

  onChange(e) {
    this.value = e.target.value;
  }
}
