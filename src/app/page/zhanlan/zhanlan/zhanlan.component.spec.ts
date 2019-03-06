import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZhanlanComponent } from './zhanlan.component';

describe('ZhanlanComponent', () => {
  let component: ZhanlanComponent;
  let fixture: ComponentFixture<ZhanlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZhanlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZhanlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
