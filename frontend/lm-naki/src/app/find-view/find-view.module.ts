import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FindViewComponent} from './find-view/find-view.component';
import {EditViewComponent} from './edit-view/edit-view.component';
import {FormsModule} from '@angular/forms';
import {MetadataEditModule} from '../metadata-edit/metadata-edit.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {EditViewDialogComponent} from './edit-view-dialog/edit-view-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,

    MetadataEditModule,
  ],
  declarations: [
    FindViewComponent,
    EditViewComponent,
    EditViewDialogComponent
  ],
  exports: [
    FindViewComponent,
    EditViewComponent,
    EditViewDialogComponent,
  ],
  entryComponents: [
    EditViewDialogComponent,
  ]
})
export class FindViewModule {
}
