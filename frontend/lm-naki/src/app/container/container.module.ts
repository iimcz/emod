import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContainerComponent} from './container/container.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {ImageContainerModule} from '../image-container/image-container.module';
import {ImageViewerComponent} from '../image-container/image-viewer/image-viewer.component';
import {GenericViewModule} from '../generic-view/generic-view.module';
import {GenericViewComponent} from '../generic-view/generic-view/generic-view.component';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {IframeViewModule} from '../iframe-view/iframe-view.module';
import {IframeViewComponent} from '../iframe-view/iframe-view/iframe-view.component';
import {VideoViewComponent} from '../video-view/video-view/video-view.component';
import {VideoViewModule} from '../video-view/video-view.module';
import {ItemPlayerComponent} from './item-player/item-player.component';
import {MotionContainerModule} from '../motion-container/motion-container.module';

@NgModule({
  imports: [
    CommonModule,
    AngularDraggableModule,
    ImageContainerModule,
    GenericViewModule,
    IframeViewModule,
    VideoViewModule,
    MotionContainerModule,

    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  exports: [
    ContainerComponent,
    ItemPlayerComponent,
  ],
  declarations: [ContainerComponent, ItemPlayerComponent],
  entryComponents: [
    // ImageViewerComponent,
    // GenericViewComponent,
    // IframeViewComponent,
    // VideoViewComponent
  ]
})
export class ContainerModule {
}
