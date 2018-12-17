import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationViewerComponent } from './annotation-viewer.component';

describe('AnnotationViewerComponent', () => {
  let component: AnnotationViewerComponent;
  let fixture: ComponentFixture<AnnotationViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
