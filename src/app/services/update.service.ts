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
    interval(1 * 60 * 1000).subscribe(() => swUpdate.checkForUpdate()
      .then(() => this.informUser()));

  }
  public informUser(): void {
    this.swUpdate.available.subscribe(event => this.commonService.emitNewAppVersionAvailableEventEmitter());
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
