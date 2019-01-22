import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[skIcon]',
  host: {
    '[attr.class]': 'className + iconClass'
  }
})
export class IconDirective {

  @Input("skIcon") iconClass: string;
  className = 'icon sk-icon sk-i-';

  constructor() { }

}
