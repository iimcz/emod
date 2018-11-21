import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetakeyEditDialogComponent } from './metakey-edit-dialog.component';

describe('MetakeyEditDialogComponent', () => {
  let component: MetakeyEditDialogComponent;
  let fixture: ComponentFixture<MetakeyEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetakeyEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetakeyEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
