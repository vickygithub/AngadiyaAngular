import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { UpdateService } from './services/update.service';
import { CommonService } from './services/common.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angadiya';
  isSuccess: any = false;
  private numberOfSeconds: number = 60;
  constructor(private _idle: Idle, private router: Router, private sw: UpdateService, private commonService: CommonService, public dialog: MatDialog, private snackbar: MatSnackBar, private swUpdate: SwUpdate) {
    this.commonService.getNewAppVersionAvailableEventEmitter().subscribe(() => {
      const snack = this.snackbar.open('Update Available', 'Reload');
      snack
        .onAction()
        .subscribe(() => window.location.reload());

    });
    this.commonService.getSuccessErrorEventEmitter().subscribe((res: any) => {
      this.isSuccess = res.success;
      if (!res.success) {
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
          data: { message: res.message },
          minWidth: "350px"
        });
      }
      setTimeout(() => {
        this.isSuccess = false
      }, 2000)
    });
  }

  ngOnInit() {

    this._idle.setIdle(this.numberOfSeconds);
    this._idle.setTimeout(this.numberOfSeconds);
    this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this._idle.onTimeout.subscribe(() => {
      // Hide the modal, log out, do something else
      this.router.navigate(['/login']);
      sessionStorage.clear();
    });

    this._idle.watch()
  }
}
