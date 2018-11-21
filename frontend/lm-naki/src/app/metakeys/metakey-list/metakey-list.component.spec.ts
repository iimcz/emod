import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetakeyListComponent } from './metakey-list.component';

describe('MetakeyListComponent', () => {
  let component: MetakeyListComponent;
  let fixture: ComponentFixture<MetakeyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetakeyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetakeyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
