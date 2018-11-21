import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPathComponent } from './select-path.component';

describe('SelectPathComponent', () => {
  let component: SelectPathComponent;
  let fixture: ComponentFixture<SelectPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
