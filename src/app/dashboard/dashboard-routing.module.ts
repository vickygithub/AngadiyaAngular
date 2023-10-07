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
import { CreateComponent } from './dashboard/account/create/create.component';
import { LedgerComponent } from './dashboard/ledger/ledger.component';
import { ReportComponent } from './dashboard/ledger/report/report.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, canActivate: [authGuard], children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: MainComponent },
      { path: 'createuser', component: CreateUserComponent },
      { path: 'account', component: AccountComponent },
      { path: 'account/edit', component: AccountDetailComponent },
      { path: 'account/create', component: CreateComponent },
      { path: 'journal', component: JournalComponent },
      { path: 'city', component: CityComponent },
      { path: 'city/add', component: AddCityComponent },
      { path: 'angadiya', component: AngadiyaComponent },
      { path: 'ledger', component: LedgerComponent },
      { path: 'ledger/report', component: ReportComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
