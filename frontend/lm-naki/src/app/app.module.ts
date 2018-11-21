import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {NakiService} from './naki.service';
// import {VideoContainerModule} from './video-container/video-container.module';
// import {ImageContainerModule} from './image-container/image-container.module';
import {AngularDraggableModule} from 'angular2-draggable';
import {ContainerModule} from './container/container.module';
import {MatButtonModule, MatButtonToggleModule, MatDialogModule, MatIconModule, MatInputModule, MatTableModule} from '@angular/material';
import {NgDragDropModule} from 'ng-drag-drop';
import {HttpClientModule} from '@angular/common/http';
import {MenuModule} from './menu/menu.module';
// import {ViewModule} from './view/view.module';

import {AppRouterModule} from './app.router';
import {HomeModule} from './home/home.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {FindItemComponent} from './find-item/find-item.component';
import {FormsModule} from '@angular/forms';
import {FindItemModule} from './find-item/find-item.module';
import {NakiDefaultPlayerService} from './naki-default-player.service';

@NgModule({
  declarations: [
    AppComponent,
    // FindItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRouterModule,
    FormsModule,

    // VideoContainerModule,
    // ImageContainerModule,
    AngularDraggableModule,
    ContainerModule,
    MenuModule,
    // ViewModule,
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
    // FindItemComponent
  ],
  exports: [
    // FindItemComponent
  ]
})
export class AppModule {
}
