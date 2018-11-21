import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaKeyComponent } from './meta-key.component';

describe('MetaKeyComponent', () => {
  let component: MetaKeyComponent;
  let fixture: ComponentFixture<MetaKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetaKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
