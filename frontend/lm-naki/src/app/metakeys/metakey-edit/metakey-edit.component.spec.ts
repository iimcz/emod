import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetakeyEditComponent } from './metakey-edit.component';

describe('MetakeyEditComponent', () => {
  let component: MetakeyEditComponent;
  let fixture: ComponentFixture<MetakeyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetakeyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetakeyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
