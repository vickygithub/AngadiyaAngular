import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CrudService } from './services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIdleModule } from '@ng-idle/core';
import { AuthService } from './auth.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { ServiceWorkerModule } from '@angular/service-worker';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CommonService } from './services/common.service';
import { UpdateService } from './services/update.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LimitMobileNumberDirective } from './limit-mobile-number.directive';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChangePasswordComponent,
    ErrorDialogComponent,
    LimitMobileNumberDirective
  ],
  imports: [
    NgIdleModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    NgxSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode()
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
    })
  ],
  providers: [CrudService, AuthService, CommonService, UpdateService],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
