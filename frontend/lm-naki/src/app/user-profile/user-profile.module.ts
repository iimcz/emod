import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material';
import {FindUserModule} from '../find-user/find-user.module';

export const routerConfig = [{
  path: '',
  children: [
    {
      path: '',
      component: UserProfileComponent
    }
  ]
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routerConfig),

    MatButtonModule,

    FindUserModule,
  ],
  declarations: [UserProfileComponent]
})
export class UserProfileModule {
}
