import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { authGuard } from 'src/app/auth.guard';
import { MainComponent } from './dashboard/main/main.component';
import { CreateUserComponent } from './dashboard/create-user/create-user.component';
import { AccountComponent } from './dashboard/account/account.component';
import { AccountDetailComponent } from './dashboard/account/account-detail/account-detail.component';
import { JournalComponent } from './dashboard/journal/journal.component';
import { CityComponent } from './dashboard/city/city.component';
import { AddCityComponent } from './dashboard/city/add-city/add-city.component';
import { AngadiyaComponent } from './dashboard/angadiya/angadiya.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, canActivate: [authGuard], children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: MainComponent },
      { path: 'createuser', component: CreateUserComponent },
      { path: 'account', component: AccountComponent },
      { path: 'account/edit', component: AccountDetailComponent },
      { path: 'journal', component: JournalComponent },
      { path: 'city', component: CityComponent },
      { path: 'city/add', component: AddCityComponent },
      { path: 'angadiya', component: AngadiyaComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
