import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceYaoqinghanPriceComponent } from './price-yaoqinghan-price.component';

describe('PriceYaoqinghanPriceComponent', () => {
  let component: PriceYaoqinghanPriceComponent;
  let fixture: ComponentFixture<PriceYaoqinghanPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceYaoqinghanPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceYaoqinghanPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
