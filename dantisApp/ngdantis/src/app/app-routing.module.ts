import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user/user.component';
import { SellerPageComponent } from './seller-page/seller-page/seller-page.component';


const routes: Routes = [
  { path: 'dash',  component: DashboardComponent  },
  { path: 'user', component: UserComponent},
  { path: 'sale', component: SellerPageComponent},
  { path: '', component: LoginComponent },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
