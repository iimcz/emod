import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkEditInputComponent } from './link-edit-input.component';

describe('LinkEditInputComponent', () => {
  let component: LinkEditInputComponent;
  let fixture: ComponentFixture<LinkEditInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkEditInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkEditInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
