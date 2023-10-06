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
import { NgxSpinnerModule } from "ngx-spinner";
import { CreateUserComponent } from './dashboard/create-user/create-user.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY'
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
    CreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTabsModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatListModule,
    MatSelectModule,
    MatDividerModule
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
