import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {NakiService} from './naki.service';
import {AngularDraggableModule} from 'angular2-draggable';
import {ContainerModule} from './container/container.module';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {NgDragDropModule} from 'ng-drag-drop';
import {HttpClientModule} from '@angular/common/http';
import {MenuModule} from './menu/menu.module';

import {AppRouterModule} from './app.router';
import {HomeModule} from './home/home.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {FindItemModule} from './find-item/find-item.module';
import {NakiDefaultPlayerService} from './naki-default-player.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRouterModule,
    FormsModule,

    AngularDraggableModule,
    ContainerModule,
    MenuModule,
    HomeModule,
    FindItemModule,

    NgDragDropModule.forRoot(),

    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
  ],
  providers: [
    NakiService,
    NakiDefaultPlayerService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
  ],
  exports: [
  ]
})
export class AppModule {
}
