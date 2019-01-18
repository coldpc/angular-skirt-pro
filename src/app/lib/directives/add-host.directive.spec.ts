import { AddHostDirective } from './add-host.directive';
import {SkDynamicComponentService} from "../../components/dynamic-component-factory/sk-dynamic-component.service";
import {TestBed} from '@angular/core/testing';
import {ViewContainerRef} from '@angular/core';

describe('AddHostDirective', () => {
  it('should create an instance', () => {
    const dynamicService: SkDynamicComponentService = TestBed.get(SkDynamicComponentService);
    const viewContainerRef: ViewContainerRef = TestBed.get(ViewContainerRef);

    const directive = new AddHostDirective(viewContainerRef, dynamicService);
    expect(directive).toBeTruthy();
  });
});
