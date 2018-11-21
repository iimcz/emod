import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindItemDialogComponent } from './find-item-dialog.component';

describe('FindItemDialogComponent', () => {
  let component: FindItemDialogComponent;
  let fixture: ComponentFixture<FindItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
