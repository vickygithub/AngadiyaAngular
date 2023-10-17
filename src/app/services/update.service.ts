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
    interval(1 * 60 * 1000).subscribe(() => {
      this.swUpdate.checkForUpdate()
      .then((res: any) => {
        this.informUser();
      }, (err) => {
      })
    });
  }
  public informUser(): void {
    this.swUpdate.versionUpdates.subscribe(event => {
      if (event.type === "VERSION_READY") {
        console.log("Update available");
        this.commonService.emitNewAppVersionAvailableEventEmitter()
      }
    });
  }
  public promptUser(): void {
    const snack = this.snackbar.open('Update Available', 'Reload');
    snack
      .onAction()
      .subscribe(() => {
        this.swUpdate.activateUpdate().then(() => window.location.reload());
      });

  }
}
