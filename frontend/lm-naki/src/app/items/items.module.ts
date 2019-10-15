import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemListComponent} from './item-list/item-list.component';
import {ItemImportComponent} from './item-import/item-import.component';
import {RouterModule} from '@angular/router';
import {ItemInfoComponent} from './item-info/item-info.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {FindItemModule} from '../find-item/find-item.module';
import {MetadataEditModule} from '../metadata-edit/metadata-edit.module';
import {FindGroupModule} from '../find-group/find-group.module';
import { ItemUploadComponent } from './item-upload/item-upload.component';
import {AngularSplitModule} from 'angular-split';
import { SelectPathComponent } from './select-path/select-path.component';


export const routerConfig = [{
  path: '',
  children: [
    {
      path: '',
      component: ItemListComponent
    },
    {
      path: 'import',
      component: ItemImportComponent
    },
    {
      path: 'upload',
      component: ItemUploadComponent
    },
    {
      path: ':id',
      redirectTo: 'show/:id',
      pathMatch: 'full'
    },
    {
      path: 'show/:id',
      component: ItemInfoComponent
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
    MatProgressSpinnerModule,
    MatProgressBarModule,

    AngularSplitModule,

    FindItemModule,
    MetadataEditModule,
    FindGroupModule,
  ],
  declarations: [
    ItemListComponent,
    ItemImportComponent,
    ItemInfoComponent,
    ItemUploadComponent,
    SelectPathComponent,
  ]
})
export class ItemsModule {
}
