import { TouchHoverDirective } from './touch-hover.directive';
import {TestBed} from '@angular/core/testing';
import {ElementRef} from '@angular/core';

describe('TouchHoverDirective', () => {
  it('should create an instance', () => {
    const el: ElementRef = TestBed.get(ElementRef);
    const directive = new TouchHoverDirective(el);
    expect(directive).toBeTruthy();
  });
});
