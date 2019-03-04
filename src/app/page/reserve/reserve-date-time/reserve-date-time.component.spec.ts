import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveDateTimeComponent } from './reserve-date-time.component';

describe('ReserveDateTimeComponent', () => {
  let component: ReserveDateTimeComponent;
  let fixture: ComponentFixture<ReserveDateTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveDateTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
