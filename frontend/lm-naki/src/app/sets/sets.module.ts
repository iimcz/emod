import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetListComponent} from './set-list/set-list.component';
import {RouterModule} from '@angular/router';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule, MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule, MatSlideToggleModule,
  MatTableModule
} from '@angular/material';
import {FindSetModule} from '../find-set/find-set.module';
import {SetInfoComponent} from './set-info/set-info.component';


export const routerConfig = [{
  path: '',
  children: [
    {
      path: '',
      component: SetListComponent
    },
    {
      path: 'show/:id',
      component: SetInfoComponent
    }
  ]
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routerConfig),

    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatExpansionModule,

    FindSetModule
  ],
  declarations: [SetListComponent, SetInfoComponent]
})

export class SetsModule {
}
