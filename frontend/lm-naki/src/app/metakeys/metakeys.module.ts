import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MetakeyListComponent} from './metakey-list/metakey-list.component';
import {MetakeyEditComponent} from './metakey-edit/metakey-edit.component';
import {MetakeyEditDialogComponent} from './metakey-edit-dialog/metakey-edit-dialog.component';
import {RouterModule} from '@angular/router';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSelectModule,
  MatTableModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';

export const routerConfig = [{
  path: '',
  children: [
    {
      path: '',
      component: MetakeyListComponent
    }
  ]
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routerConfig),
    FormsModule,

    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,

  ],
  declarations: [
    MetakeyListComponent,
    MetakeyEditComponent,
    MetakeyEditDialogComponent
  ],
  exports: [
    MetakeyListComponent,
    MetakeyEditComponent,
    MetakeyEditDialogComponent
  ],
  entryComponents: [
    MetakeyEditDialogComponent
  ]
})
export class MetakeysModule {
}
