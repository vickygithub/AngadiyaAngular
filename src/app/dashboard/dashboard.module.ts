import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './dashboard/main/main.component';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateUserComponent } from './dashboard/create-user/create-user.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AccountComponent } from './dashboard/account/account.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AccountDetailComponent } from './dashboard/account/account-detail/account-detail.component';
import { MatRadioModule } from '@angular/material/radio';
import { JournalComponent } from './dashboard/journal/journal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CashReceiptComponent } from './dashboard/journal/cash-receipt/cash-receipt.component';
import { CityComponent } from './dashboard/city/city.component';
import { MatListModule } from '@angular/material/list';
import { AddCityComponent } from './dashboard/city/add-city/add-city.component';
import { AngadiyaComponent } from './dashboard/angadiya/angadiya.component';
import { SendComponent } from './dashboard/angadiya/send/send.component';
import { ReceivedComponent } from './dashboard/angadiya/received/received.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CreateComponent } from './dashboard/account/create/create.component';
import { LimitMobileNumberDirective } from './limit-mobile-number.directive';
import { LedgerComponent } from './dashboard/ledger/ledger.component';
import { ReportComponent } from './dashboard/ledger/report/report.component';
import { MatTableModule } from '@angular/material/table';
import { TrialBalanceComponent } from './dashboard/trial-balance/trial-balance.component';
import { ClosingBalanceSummaryComponent } from './dashboard/ledger/report/closing-balance-summary/closing-balance-summary.component';
import { JournalTransactionComponent } from './dashboard/journal/journal-transaction/journal-transaction.component';
import { AngadiyaListComponent } from './dashboard/angadiya-list/angadiya-list.component';
import { OpeningTrialBalanceComponent } from './dashboard/opening-trial-balance/opening-trial-balance.component';
import { CashTransactionListComponent } from './dashboard/cash-transaction-list/cash-transaction-list.component';
import { JournalListComponent } from './dashboard/journal-list/journal-list.component';
import { SentListComponent } from './dashboard/angadiya-list/sent-list/sent-list.component';
import { ReceivedListComponent } from './dashboard/angadiya-list/received-list/received-list.component';
import { PaymentListComponent } from './dashboard/cash-transaction-list/payment-list/payment-list.component';
import { ReceiptListComponent } from './dashboard/cash-transaction-list/receipt-list/receipt-list.component';
import { HisaabComponent } from './dashboard/hisaab/hisaab.component';
import { PnlComponent } from './dashboard/hisaab/pnl/pnl.component';
import { HisaabListComponent } from './dashboard/hisaab-list/hisaab-list.component';
import { ProfitListComponent } from './dashboard/hisaab-list/profit-list/profit-list.component';
import { LossListComponent } from './dashboard/hisaab-list/loss-list/loss-list.component';
import { SettlingComponent } from './dashboard/settling/settling.component';
import { SettlingTransactionComponent } from './dashboard/settling/settling-transaction/settling-transaction.component';
import { SettlingListComponent } from './dashboard/settling-list/settling-list.component';
import { SettlingPaymentListComponent } from './dashboard/settling-list/settling-payment-list/settling-payment-list.component';
import { SettlingReceiptListComponent } from './dashboard/settling-list/settling-receipt-list/settling-receipt-list.component';
import { PnlBothComponent } from './dashboard/hisaab-list/pnl-both/pnl-both.component';
import {MatExpansionModule} from '@angular/material/expansion';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  },
};

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    MainComponent,
    CreateUserComponent,
    AccountComponent,
    AccountDetailComponent,
    JournalComponent,
    CashReceiptComponent,
    CityComponent,
    AddCityComponent,
    AngadiyaComponent,
    SendComponent,
    ReceivedComponent,
    CreateComponent,
    LimitMobileNumberDirective,
    LedgerComponent,
    ReportComponent,
    TrialBalanceComponent,
    ClosingBalanceSummaryComponent,
    JournalTransactionComponent,
    AngadiyaListComponent,
    OpeningTrialBalanceComponent,
    CashTransactionListComponent,
    JournalListComponent,
    SentListComponent,
    ReceivedListComponent,
    PaymentListComponent,
    ReceiptListComponent,
    HisaabComponent,
    PnlComponent,
    HisaabListComponent,
    ProfitListComponent,
    LossListComponent,
    SettlingComponent,
    SettlingTransactionComponent,
    SettlingListComponent,
    SettlingPaymentListComponent,
    SettlingReceiptListComponent,
    PnlBothComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatListModule,
    MatSelectModule,
    MatDividerModule,
    MatTableModule,
    MatExpansionModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DashboardModule { }
