import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnnotationViewerComponent} from './annotation-viewer/annotation-viewer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AnnotationViewerComponent],
  entryComponents: [AnnotationViewerComponent]
})
export class AnnotationViewerModule {
}
