import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeViewComponent } from './iframe-view.component';

describe('IframeViewComponent', () => {
  let component: IframeViewComponent;
  let fixture: ComponentFixture<IframeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IframeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
