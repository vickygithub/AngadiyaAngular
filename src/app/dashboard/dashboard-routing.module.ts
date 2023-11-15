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
import { TrialBalanceComponent } from './dashboard/trial-balance/trial-balance.component';
import { AngadiyaListComponent } from './dashboard/angadiya-list/angadiya-list.component';
import { OpeningTrialBalanceComponent } from './dashboard/opening-trial-balance/opening-trial-balance.component';
import { JournalTransactionComponent } from './dashboard/journal/journal-transaction/journal-transaction.component';
import { CashTransactionListComponent } from './dashboard/cash-transaction-list/cash-transaction-list.component';
import { JournalListComponent } from './dashboard/journal-list/journal-list.component';
import { HisaabComponent } from './dashboard/hisaab/hisaab.component';
import { HisaabListComponent } from './dashboard/hisaab-list/hisaab-list.component';
import { SettlingComponent } from './dashboard/settling/settling.component';
import { SettlingListComponent } from './dashboard/settling-list/settling-list.component';
import { ReportSummaryComponent } from './dashboard/report-summary/report-summary.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      {
        path: 'main', component: MainComponent, canActivate: [authGuard]
      },
      {
        path: 'createuser', component: CreateUserComponent, canActivate: [authGuard], data: {
          projectTypes: [1]
        }
      },
      { path: 'account', component: AccountComponent },
      { path: 'account/edit', component: AccountDetailComponent },
      { path: 'account/create', component: CreateComponent },
      { path: 'journaltransaction', component: JournalTransactionComponent },
      { path: 'cashtransaction', component: JournalComponent },
      {
        path: 'city', component: CityComponent, canActivate: [authGuard], data: {
          projectTypes: [2]
        }
      },
      {
        path: 'city/add', component: AddCityComponent, canActivate: [authGuard], data: {
          projectTypes: [2]
        }
      },
      {
        path: 'angadiya', component: AngadiyaComponent, canActivate: [authGuard], data: {
          projectTypes: [2]
        }
      },
      { path: 'ledger', component: LedgerComponent },
      { path: 'ledger/report', component: ReportComponent },
      { path: 'trialbalance', component: TrialBalanceComponent },
      { path: 'openingtrialbalance', component: OpeningTrialBalanceComponent },
      {
        path: 'angadiyalist', component: AngadiyaListComponent, canActivate: [authGuard], data: {
          projectTypes: [2]
        }
      },
      { path: 'cashtransactionlist', component: CashTransactionListComponent },
      { path: 'journallist', component: JournalListComponent },
      {
        path: 'hisaab', component: HisaabComponent, canActivate: [authGuard], data: {
          projectTypes: [4]
        }
      },
      {
        path: 'hisaablist', component: HisaabListComponent, canActivate: [authGuard], data: {
          projectTypes: [4]
        }
      },
      {
        path: 'settling', component: SettlingComponent, canActivate: [authGuard], data: {
          projectTypes: [4]
        }
      },
      {
        path: 'settlinglist', component: SettlingListComponent, canActivate: [authGuard], data: {
          projectTypes: [4]
        }
      },
      {
        path: 'reportsummary/:type', component: ReportSummaryComponent, canActivate: [authGuard], data: {
          projectTypes: [4]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
