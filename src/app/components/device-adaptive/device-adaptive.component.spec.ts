import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceAdaptiveComponent } from './device-adaptive.component';

describe('DeviceAdaptiveComponent', () => {
  let component: DeviceAdaptiveComponent;
  let fixture: ComponentFixture<DeviceAdaptiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceAdaptiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceAdaptiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
