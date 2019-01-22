import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[skIcon]',
  host: {
    '[attr.class]': 'className + iconClass'
  }
})
export class IconDirective {

  @Input("skIcon") iconClass: string;

  // 固定的className
  className = 'icon sk-icon sk-i-';

  constructor(private el: ElementRef) {
    let originClass = el.nativeElement.className;
    if (originClass) {
      this.className = `${originClass} ${this.className}`;
    }
  }

}
