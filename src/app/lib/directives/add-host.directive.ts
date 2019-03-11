import { Directive, ViewContainerRef } from '@angular/core';
import {SkDynamicComponentService} from "../../components/dynamic-component-factory/sk-dynamic-component.service";

@Directive({
  selector: '[skAddHost]'
})
export class AddHostDirective {
  constructor(public viewContainerRef: ViewContainerRef, private dynamicService: SkDynamicComponentService) {
    this.dynamicService.setContainerRef(viewContainerRef);
  }
}
