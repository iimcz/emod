import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditGroupComponent} from './edit-group/edit-group.component';
import {EditGroupDialogComponent} from './edit-group-dialog/edit-group-dialog.component';
import {FindGroupComponent} from './find-group/find-group.component';
import {FindGroupDialogComponent} from './find-group-dialog/find-group-dialog.component';
import {FormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {MetadataEditModule} from '../metadata-edit/metadata-edit.module';
import {FindItemModule} from '../find-item/find-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule,
    MatButtonModule,
    MatExpansionModule,

    MetadataEditModule,
    FindItemModule,
  ],
  declarations: [
    EditGroupComponent,
    EditGroupDialogComponent,
    FindGroupComponent,
    FindGroupDialogComponent
  ],
  exports: [
    EditGroupComponent,
    EditGroupDialogComponent,
    FindGroupComponent,
    FindGroupDialogComponent
  ],
  entryComponents: [
    EditGroupDialogComponent,
    FindGroupDialogComponent
  ]
})
export class FindGroupModule {
}
