import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QiangXianTiYanComponent } from './qiang-xian-ti-yan.component';

describe('QiangXianTiYanComponent', () => {
  let component: QiangXianTiYanComponent;
  let fixture: ComponentFixture<QiangXianTiYanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QiangXianTiYanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QiangXianTiYanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
