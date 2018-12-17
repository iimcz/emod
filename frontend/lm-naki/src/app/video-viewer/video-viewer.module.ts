import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VideoViewerComponent} from './video-viewer/video-viewer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [VideoViewerComponent],
  entryComponents: [VideoViewerComponent]
})
export class VideoViewerModule {
}
