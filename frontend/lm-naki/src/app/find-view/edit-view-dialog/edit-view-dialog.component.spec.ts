import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditViewDialogComponent } from './edit-view-dialog.component';

describe('EditViewDialogComponent', () => {
  let component: EditViewDialogComponent;
  let fixture: ComponentFixture<EditViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
