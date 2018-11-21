import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GenericViewComponent} from './generic-view/generic-view.component';
import {MatButtonModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule
  ],
  declarations: [GenericViewComponent],
  entryComponents: [
    GenericViewComponent
  ]
})
export class GenericViewModule {
}
