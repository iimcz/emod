import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContainerComponent} from './container/container.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {ImageContainerModule} from '../image-container/image-container.module';
import {GenericViewerModule} from '../generic-viewer/generic-viewer.module';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {IframeViewerModule} from '../iframe-viewer/iframe-viewer.module';
import {VideoViewModule} from '../video-view/video-view.module';
import {MotionContainerModule} from '../motion-container/motion-container.module';

@NgModule({
  imports: [
    CommonModule,
    AngularDraggableModule,
    ImageContainerModule,
    GenericViewModule,
    IframeViewerModule,
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
  ]
})
export class ContainerModule {
}
