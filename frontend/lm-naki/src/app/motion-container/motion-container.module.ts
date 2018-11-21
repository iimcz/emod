import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionViewComponent } from './motion-view/motion-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MotionViewComponent
  ],
  exports: [
    MotionViewComponent
  ],
  entryComponents: [
    MotionViewComponent
  ]
})
export class MotionContainerModule { }
