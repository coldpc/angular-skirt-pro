import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoolMenuComponent } from './cool-menu.component';

describe('CoolMenuComponent', () => {
  let component: CoolMenuComponent;
  let fixture: ComponentFixture<CoolMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoolMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoolMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
