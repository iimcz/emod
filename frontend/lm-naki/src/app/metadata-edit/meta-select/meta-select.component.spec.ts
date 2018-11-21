import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaSelectComponent } from './meta-select.component';

describe('MetaSelectComponent', () => {
  let component: MetaSelectComponent;
  let fixture: ComponentFixture<MetaSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetaSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
