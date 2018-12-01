import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FindSetComponent} from './find-set/find-set.component';
import {FindSetDialogComponent} from './find-set-dialog/find-set-dialog.component';
import {EditSetComponent} from './edit-set/edit-set.component';
import {EditSetDialogComponent} from './edit-set-dialog/edit-set-dialog.component';
import {
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatTableModule
} from '@angular/material';
import {MetadataEditModule} from '../metadata-edit/metadata-edit.module';
import {RouterModule} from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule,
    MatButtonModule,
    MatExpansionModule,

    MetadataEditModule,
  ],
  declarations: [
    FindSetComponent,
    FindSetDialogComponent,
    EditSetComponent,
    EditSetDialogComponent
  ],
  exports: [
    FindSetComponent,
    FindSetDialogComponent,
    EditSetComponent,
    EditSetDialogComponent
  ],
  entryComponents: [
    FindSetDialogComponent,
    EditSetDialogComponent,
  ]
})
export class FindSetModule {
}
