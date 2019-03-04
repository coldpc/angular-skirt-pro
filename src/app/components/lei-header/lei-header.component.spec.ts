import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeiHeaderComponent } from './lei-header.component';

describe('LeiHeaderComponent', () => {
  let component: LeiHeaderComponent;
  let fixture: ComponentFixture<LeiHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeiHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeiHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
