import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSetDialogComponent } from './find-set-dialog.component';

describe('FindSetDialogComponent', () => {
  let component: FindSetDialogComponent;
  let fixture: ComponentFixture<FindSetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindSetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindSetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
