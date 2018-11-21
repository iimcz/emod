import {Input, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageViewerComponent} from './image-viewer/image-viewer.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {MatButtonModule, MatIconModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    AngularDraggableModule,

    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    ImageViewerComponent
  ],
  declarations: [ImageViewerComponent],
  entryComponents: [ImageViewerComponent]
})
export class ImageContainerModule {

}
