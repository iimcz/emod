import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotionViewComponent } from './motion-view.component';

describe('MotionViewComponent', () => {
  let component: MotionViewComponent;
  let fixture: ComponentFixture<MotionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
