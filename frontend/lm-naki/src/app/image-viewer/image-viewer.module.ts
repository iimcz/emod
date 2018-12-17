import {Input, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageViewerComponent} from './image-viewer/image-viewer.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {MatButtonModule, MatDialogModule, MatIconModule} from '@angular/material';
import {AnnotationModule} from '../annotation/annotation.module';

@NgModule({
  imports: [
    CommonModule,
    AngularDraggableModule,

    AnnotationModule,

    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [
    ImageViewerComponent
  ],
  declarations: [ImageViewerComponent],
  entryComponents: [ImageViewerComponent]
})
export class ImageViewerModule {

}
