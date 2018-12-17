import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericViewerComponent } from './generic-viewer.component';

describe('GenericViewerComponent', () => {
  let component: GenericViewerComponent;
  let fixture: ComponentFixture<GenericViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
