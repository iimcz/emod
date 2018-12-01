import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetInfoComponent } from './set-info.component';

describe('SetInfoComponent', () => {
  let component: SetInfoComponent;
  let fixture: ComponentFixture<SetInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
