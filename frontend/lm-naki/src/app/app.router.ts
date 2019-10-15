import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home/home.component';
// import {ViewComponent} from './view/view/view.component';
// import {ItemsModule} from './items/items.module';


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'items', loadChildren: () => import('./items/items.module').then(m => m.ItemsModule)},
  {path: 'groups', loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)},
  {path: 'sets', loadChildren: () => import('./sets/sets.module').then(m => m.SetsModule)},
  {path: 'views', loadChildren: () => import('./view/view.module').then(m => m.ViewModule)},
  {path: 'metakeys', loadChildren: () => import('./metakeys/metakeys.module').then(m => m.MetakeysModule)},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
  {path: 'profile', loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)},
  // {path: 'view', component: ViewComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false, enableTracing: false})],
  exports: [RouterModule]
})
export class AppRouterModule {
}

