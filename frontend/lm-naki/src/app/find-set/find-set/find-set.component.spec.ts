import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSetComponent } from './find-set.component';

describe('FindSetComponent', () => {
  let component: FindSetComponent;
  let fixture: ComponentFixture<FindSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
