import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { CommonService } from './common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private swUpdate: SwUpdate, private commonService: CommonService, private snackbar: MatSnackBar) {
    this.checkUpdates();
  }
  private checkUpdates() {
    console.log("interval will start");
    interval(1 * 60 * 1000).subscribe(() => {
      console.log("checking for update")
      this.swUpdate.checkForUpdate()
      .then((res: any) => {
        console.log("checkForUpdate response", res);
        this.informUser();
      }, (err) => {
        console.log("checkForUpdate error", err);
      })
    });
  }
  public informUser(): void {
    this.swUpdate.versionUpdates.subscribe(event => {
      console.log("is update available", event);
      this.commonService.emitNewAppVersionAvailableEventEmitter()
    });
  }
  public promptUser(): void {
    console.log("snackbar coming")
    const snack = this.snackbar.open('Update Available', 'Reload');
    snack
      .onAction()
      .subscribe(() => {
        this.swUpdate.activateUpdate().then(() => window.location.reload());
      });

  }
}
