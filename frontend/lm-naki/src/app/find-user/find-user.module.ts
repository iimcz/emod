import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FindUserComponent} from './find-user/find-user.component';
import {FindUserDialogComponent} from './find-user-dialog/find-user-dialog.component';
import {EditUserDialogComponent} from './edit-user-dialog/edit-user-dialog.component';
import {EditUserComponent} from './edit-user/edit-user.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {FormsModule} from '@angular/forms';

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
    MatSelectModule,
  ],
  declarations: [
    FindUserComponent,
    FindUserDialogComponent,
    EditUserDialogComponent,
    EditUserComponent
  ],
  exports: [
    FindUserComponent,
    FindUserDialogComponent,
    EditUserDialogComponent,
    EditUserComponent
  ],
  entryComponents: [
    FindUserDialogComponent,
    EditUserDialogComponent
  ]
})
export class FindUserModule {
}
