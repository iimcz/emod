import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IframeViewComponent} from './iframe-view/iframe-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IframeViewComponent],
  entryComponents: [IframeViewComponent]
})
export class IframeViewModule {
}

