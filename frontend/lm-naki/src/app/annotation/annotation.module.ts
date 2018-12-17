import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditAnnotationDialogComponent} from './edit-annotation-dialog/edit-annotation-dialog.component';
import {MatButtonModule, MatDialogModule, MatInputModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatButtonModule,
    MatInputModule,
  ],
  declarations: [
    EditAnnotationDialogComponent
  ],
  entryComponents: [
    EditAnnotationDialogComponent
  ]
})
export class AnnotationModule {
}
