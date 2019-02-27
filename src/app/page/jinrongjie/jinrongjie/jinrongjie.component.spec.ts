import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JinrongjieComponent } from './jinrongjie.component';

describe('JinrongjieComponent', () => {
  let component: JinrongjieComponent;
  let fixture: ComponentFixture<JinrongjieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JinrongjieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JinrongjieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
