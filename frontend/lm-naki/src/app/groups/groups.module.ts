import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupListComponent} from './group-list/group-list.component';
import {ItemListComponent} from '../items/item-list/item-list.component';
import {ItemImportComponent} from '../items/item-import/item-import.component';
import {ItemInfoComponent} from '../items/item-info/item-info.component';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule, MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule, MatSlideToggleModule,
  MatTableModule
} from '@angular/material';
import {FindGroupModule} from '../find-group/find-group.module';
import {GroupInfoComponent} from './group-info/group-info.component';


export const routerConfig = [{
  path: '',
  children: [
    {
      path: '',
      component: GroupListComponent
    },
    // ,
    // {
    //   path: 'import',
    //   component: ItemImportComponent
    // },
    // {
    //   path: ':id',
    //   redirectTo: 'show/:id',
    //   pathMatch: 'full'
    // },
    {
      path: 'show/:id',
      component: GroupInfoComponent
    }
  ]

}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routerConfig),
    FormsModule,

    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatExpansionModule,

    FindGroupModule

  ],
  declarations: [
    GroupListComponent,
    GroupInfoComponent
  ]
})
export class GroupsModule {
}
