import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XunzhaoComponent } from './xunzhao.component';

describe('XunzhaoComponent', () => {
  let component: XunzhaoComponent;
  let fixture: ComponentFixture<XunzhaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XunzhaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XunzhaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
