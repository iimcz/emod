import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export const routerConfig: Routes = [{
  path: '',
  children: [
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'logout',
      component: LoginComponent,
      data: {logout: true}
    },
  ]

}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routerConfig),

    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    LoginComponent
  ]
})
export class AuthModule {
}
