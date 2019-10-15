import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetListComponent} from './set-list/set-list.component';
import {RouterModule} from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
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
