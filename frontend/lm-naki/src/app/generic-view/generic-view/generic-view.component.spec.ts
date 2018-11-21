import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericViewComponent } from './generic-view.component';

describe('GenericViewComponent', () => {
  let component: GenericViewComponent;
  let fixture: ComponentFixture<GenericViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
