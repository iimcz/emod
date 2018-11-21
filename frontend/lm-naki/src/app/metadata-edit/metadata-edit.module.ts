import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MetaKeyComponent} from './meta-key/meta-key.component';
import {MetaSelectComponent} from './meta-select/meta-select.component';
import {MetaListComponent} from './meta-list/meta-list.component';
import {FormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatButtonModule, MatIconModule, MatInputModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,

  ],
  declarations: [
    MetaKeyComponent,
    MetaSelectComponent,
    MetaListComponent
  ],
  exports: [
    MetaKeyComponent,
    MetaSelectComponent,
    MetaListComponent
  ]
})
export class MetadataEditModule {
}
