import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerComponent} from './container.component';
import {Directive, ElementRef, Input} from '@angular/core';
import {IPosition} from 'angular2-draggable';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Directive({exportAs: 'ngDraggable', selector: '[ngDraggable]'})
class DraggableStubDirective {
  @Input() ngDraggable: boolean;
  @Input() gridSize: any;
  @Input() bounds: any;
  @Input() position: IPosition;
  @Input() inBounds: boolean;

}

@Directive({exportAs: 'ngResizable', selector: '[ngResizable]'})
class ResizableStubDirective {
  @Input() ngResizable: boolean;
  @Input() rzHandles: string;
  @Input() rzGrid: number[];
  @Input() rzContainment: ElementRef;
  @Input() rzMinWidth: number;
  @Input() rzMaxWidth: number;
  @Input() rzMinHeight: number;
  @Input() rzMaxHeight: number;
}

describe('ContainerComponent', () => {
  let component: ContainerComponent;
  let fixture: ComponentFixture<ContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContainerComponent,
        DraggableStubDirective,
        ResizableStubDirective,
      ],
      imports: [
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
