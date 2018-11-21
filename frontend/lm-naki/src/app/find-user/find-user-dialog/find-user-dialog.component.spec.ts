import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindUserDialogComponent } from './find-user-dialog.component';

describe('FindUserDialogComponent', () => {
  let component: FindUserDialogComponent;
  let fixture: ComponentFixture<FindUserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
