import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LinksListComponent} from './links-list/links-list.component';
import {MatButtonModule, MatIconModule, MatInputModule, MatOptionModule, MatSelectModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import { LinkEditInputComponent } from './link-edit-input/link-edit-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [
    LinksListComponent,
    LinkEditInputComponent
  ],
  exports: [
    LinksListComponent
  ]
})
export class LinksEditModule {
}
