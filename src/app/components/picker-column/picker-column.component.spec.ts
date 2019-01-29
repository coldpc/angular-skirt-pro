import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickerColumnComponent } from './picker-column.component';

describe('PickerColumnComponent', () => {
  let component: PickerColumnComponent;
  let fixture: ComponentFixture<PickerColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickerColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
