import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindViewComponent } from './find-view.component';

describe('FindViewComponent', () => {
  let component: FindViewComponent;
  let fixture: ComponentFixture<FindViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
