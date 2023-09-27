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

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule
  ]
})
export class DashboardModule { }
