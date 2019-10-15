import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FindItemComponent} from './find-item/find-item.component';
import {
  MatButtonModule, MatCheckboxModule,
  MatDialogModule, MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatTableModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {FindItemDialogComponent} from './find-item-dialog/find-item-dialog.component';
import {EditItemComponent} from './edit-item/edit-item.component';
import {EditItemDialogComponent} from './edit-item-dialog/edit-item-dialog.component';
import {ItemPreviewComponent} from './item-preview/item-preview.component';
import {ContainerModule} from '../container/container.module';
import {MetadataEditModule} from '../metadata-edit/metadata-edit.module';
import {RouterModule} from '@angular/router';
import {LinksEditModule} from '../links-edit/links-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatExpansionModule,

    ContainerModule,
    MetadataEditModule,
    LinksEditModule
  ],
  declarations: [
    FindItemComponent,
    FindItemDialogComponent,
    EditItemComponent,
    EditItemDialogComponent,
    ItemPreviewComponent
  ],
  exports: [
    FindItemComponent,
    FindItemDialogComponent,
    ItemPreviewComponent,
  ],
  entryComponents: [
    FindItemDialogComponent,
    EditItemDialogComponent,
  ]
})
export class FindItemModule {
}
