import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPlayerComponent } from './item-player.component';

describe('ItemPlayerComponent', () => {
  let component: ItemPlayerComponent;
  let fixture: ComponentFixture<ItemPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
