import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { authGuard } from 'src/app/auth.guard';
import { MainComponent } from './dashboard/main/main.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [authGuard], children: [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', component: MainComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
