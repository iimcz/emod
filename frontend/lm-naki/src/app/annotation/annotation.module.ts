import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditAnnotationDialogComponent} from './edit-annotation-dialog/edit-annotation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
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
