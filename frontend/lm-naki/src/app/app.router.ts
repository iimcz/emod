import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home/home.component';
// import {ViewComponent} from './view/view/view.component';
// import {ItemsModule} from './items/items.module';


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'items', loadChildren: './items/items.module#ItemsModule'},
  {path: 'groups', loadChildren: './groups/groups.module#GroupsModule'},
  {path: 'views', loadChildren: './view/view.module#ViewModule'},
  {path: 'metakeys', loadChildren: './metakeys/metakeys.module#MetakeysModule'},
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  {path: 'users', loadChildren: './users/users.module#UsersModule'},
  {path: 'profile', loadChildren: './user-profile/user-profile.module#UserProfileModule'},
  // {path: 'view', component: ViewComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false, enableTracing: false})],
  exports: [RouterModule]
})
export class AppRouterModule {
}

