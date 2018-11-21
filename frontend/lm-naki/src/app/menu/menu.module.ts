import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from './menu/menu.component';
import {MatIconModule, MatToolbarModule, MatMenuModule} from '@angular/material';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule
  ],
  exports: [
    MenuComponent
  ],
  declarations: [MenuComponent]
})
export class MenuModule {
}
