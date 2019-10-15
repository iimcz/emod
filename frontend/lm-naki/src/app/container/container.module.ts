import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContainerComponent} from './container/container.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {ImageViewerModule} from '../image-viewer/image-viewer.module';
import {GenericViewerModule} from '../generic-viewer/generic-viewer.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {IframeViewerModule} from '../iframe-viewer/iframe-viewer.module';
import {VideoViewerModule} from '../video-viewer/video-viewer.module';
import {ItemPlayerComponent} from './item-player/item-player.component';
import {MotionViewerModule} from '../motion-viewer/motion-viewer.module';
import {AnnotationViewerModule} from '../annotation-viewer/annotation-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    AngularDraggableModule,
    ImageViewerModule,
    GenericViewerModule,
    IframeViewerModule,
    VideoViewerModule,
    MotionViewerModule,
    AnnotationViewerModule,

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
