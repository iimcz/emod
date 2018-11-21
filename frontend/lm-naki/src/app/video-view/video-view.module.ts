import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VideoViewComponent} from './video-view/video-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [VideoViewComponent],
  entryComponents: [VideoViewComponent]
})
export class VideoViewModule {
}
