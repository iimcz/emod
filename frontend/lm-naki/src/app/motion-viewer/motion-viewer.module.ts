import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionViewerComponent } from './motion-viewer/motion-viewer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MotionViewerComponent
  ],
  exports: [
    MotionViewerComponent
  ],
  entryComponents: [
    MotionViewerComponent
  ]
})
export class MotionViewerModule { }
