import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerScrollComponent } from './inner-scroll.component';

describe('SkNativeScrollComponent', () => {
  let component: InnerScrollComponent;
  let fixture: ComponentFixture<InnerScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerScrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
