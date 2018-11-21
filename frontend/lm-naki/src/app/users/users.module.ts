import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import {FindUserModule} from '../find-user/find-user.module';
import {RouterModule} from '@angular/router';

export const routerConfig = [{
  path: '',
  children: [
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full'
    },
    {
      path: 'list',
      component: UserListComponent
    }
  ]
}];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routerConfig),

    FindUserModule,

  ],
  declarations: [UserListComponent]
})
export class UsersModule { }

