import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarPriceComponent } from './car-price.component';

describe('CarPriceComponent', () => {
  let component: CarPriceComponent;
  let fixture: ComponentFixture<CarPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
