import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeViewerComponent } from './iframe-viewer.component';

describe('IframeViewerComponent', () => {
  let component: IframeViewerComponent;
  let fixture: ComponentFixture<IframeViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IframeViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
