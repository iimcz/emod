import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GenericViewerComponent} from './generic-viewer/generic-viewer.component';
import {MatButtonModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule
  ],
  declarations: [GenericViewerComponent],
  entryComponents: [
    GenericViewerComponent
  ]
})
export class GenericViewerModule {
}
