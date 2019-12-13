import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewComponent} from './view/view.component';
import {NgDragDropModule} from 'ng-drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {ContainerModule} from '../container/container.module';
import {AngularSplitModule} from 'angular-split';
import {RouterModule} from '@angular/router';
import {ViewListComponent} from './view-list/view-list.component';
import {FindViewModule} from '../find-view/find-view.module';
import {FindGroupModule} from '../find-group/find-group.module';
import {ViewShowComponent} from './view-show/view-show.component';
import {FormsModule} from '@angular/forms';

export const routerConfig = [{
  path: '',
  children: [
    {
      path: '',
      component: ViewListComponent
    },
    {
      path: ':id',
      redirectTo: 'show/:id',
      pathMatch: 'full'
    },
    {
      path: 'edit/:id',
      component: ViewComponent
    },
    {
      path: 'show/:id',
      component: ViewShowComponent
    },
  ]

}];

@NgModule({
  imports: [
    // Angular modules
    CommonModule,
    RouterModule.forChild(routerConfig),
    FormsModule,

    // Material modules
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatMenuModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTooltipModule,

    // Library modules
    NgDragDropModule.forRoot(),
    AngularSplitModule,

    // Own modules
    ContainerModule,
    FindViewModule,
    FindGroupModule
  ],
  declarations: [ViewComponent, ViewListComponent, ViewShowComponent]
})
export class ViewModule {
}
