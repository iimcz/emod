import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IframeViewerComponent} from './iframe-view/iframe-viewer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IframeViewerComponent],
  entryComponents: [IframeViewerComponent]
})
export class IframeViewerModule {
}

