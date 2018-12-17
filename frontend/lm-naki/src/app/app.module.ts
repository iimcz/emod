import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {NakiService} from './naki.service';
import {AngularDraggableModule} from 'angular2-draggable';
import {ContainerModule} from './container/container.module';
import {MatButtonModule, MatButtonToggleModule, MatDialogModule, MatIconModule, MatInputModule, MatTableModule} from '@angular/material';
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
